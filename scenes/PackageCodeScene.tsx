import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import useSWR from 'swr';

import { Label, P, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import { FileIcon } from '~/components/Icons';
import CodeBrowserContent from '~/components/Package/CodeBrowser/CodeBrowserContent';
import DetailsNavigation from '~/components/Package/DetailsNavigation';
import NotFound from '~/components/Package/NotFound';
import PackageHeader from '~/components/Package/PackageHeader';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import PageMeta from '~/components/PageMeta';
import { type UnpkgMeta } from '~/types';
import { type PackageCodePageProps } from '~/types/pages';
import { TimeRange } from '~/util/datetime';
import tw from '~/util/tailwind';

export default function PackageCodeScene({ apiData, packageName }: PackageCodePageProps) {
  const { isSmallScreen } = useLayout();
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const library = useMemo(
    () => apiData.libraries.find(lib => lib.npmPkg === packageName),
    [apiData.libraries, packageName]
  );

  const { data, isLoading } = useSWR<UnpkgMeta>(
    `/api/proxy/unpkg?name=${packageName}&path=?meta`,
    (url: string) => fetch(url).then(res => res.json()),
    {
      dedupingInterval: TimeRange.HOUR * 1000,
      revalidateOnFocus: false,
    }
  );

  const sortedFiles = useMemo(
    () =>
      [...(data?.files ?? [])].sort((a, b) => {
        const leftPath = getRelativeFilePath(a.path, data?.prefix);
        const rightPath = getRelativeFilePath(b.path, data?.prefix);
        const leftIsNested = leftPath.includes('/');
        const rightIsNested = rightPath.includes('/');

        if (leftIsNested !== rightIsNested) {
          return leftIsNested ? -1 : 1;
        }

        return leftPath.localeCompare(rightPath);
      }),
    [data?.files, data?.prefix]
  );

  if (!library) {
    return <NotFound />;
  }

  return (
    <>
      <PageMeta
        title={library.npmPkg}
        description="See package directory score details"
        path="package"
      />
      <DetailsNavigation library={library} />
      <ContentContainer style={tw`my-6 px-5 pb-3`}>
        <View style={tw`flex-1 gap-3`}>
          <PackageHeader library={library} />
          <View
            id="codeBrowser"
            style={tw`mt-2 flex h-[70vh] overflow-hidden rounded-xl border border-palette-gray2 text-black dark:border-default dark:text-white`}>
            {isLoading && (
              <View style={tw`flex min-h-[320px] items-center justify-center`}>
                <ThreeDotsLoader />
              </View>
            )}
            {!data && !isLoading && <P>Cannot fetch package bundle code.</P>}
            {data && !isLoading && (
              <View style={[tw`flex h-[70vh] flex-row`, isSmallScreen && tw`flex-col`]}>
                <ScrollView
                  id="codeBrowserList"
                  style={[
                    tw`flex-grow-0 border-palette-gray2 dark:border-default`,
                    isSmallScreen ? tw`border-b` : tw`border-r`,
                  ]}
                  contentContainerStyle={[
                    tw`flex-0 px-3 py-2`,
                    isSmallScreen ? tw`h-[320px]` : tw`w-[320px]`,
                  ]}>
                  {sortedFiles.map(file => {
                    const cleanPath = getRelativeFilePath(file.path, data.prefix);
                    return (
                      <Pressable
                        key={file.path}
                        style={tw`flex flex-row items-center gap-1.5 py-1`}
                        onPress={() => setActiveFile(cleanPath)}>
                        <FileIcon style={tw`size-4 shrink-0 text-icon`} />
                        <Label
                          style={[
                            tw`font-mono break-words`,
                            cleanPath === activeFile && tw`text-primary-darker dark:text-primary`,
                          ]}>
                          {cleanPath}
                        </Label>
                      </Pressable>
                    );
                  })}
                </ScrollView>
                <View
                  style={[
                    tw`flex flex-1 bg-white dark:bg-[#0d1117]`,
                    !activeFile && tw`items-center justify-center`,
                    isSmallScreen && tw`min-h-[50vh]`,
                  ]}>
                  {activeFile ? (
                    <CodeBrowserContent packageName={packageName} filePath={activeFile} />
                  ) : (
                    <View style={tw`flex flex-col items-center gap-1`}>
                      <FileIcon style={tw`mb-2 size-20 text-icon`} />
                      <P>Select file to preview from the list on the left.</P>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </ContentContainer>
    </>
  );
}

function getRelativeFilePath(path: string, prefix?: string) {
  return prefix ? path.replace(prefix, '') : path;
}
