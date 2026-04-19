import { useEffect, useMemo, useRef, useState } from 'react';
import { type ColorValue, ScrollView, TextInput, View } from 'react-native';
import useSWR from 'swr';

import { Label, P, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import { FileIcon, Search as SearchIcon } from '~/components/Icons';
import CodeBrowserContent from '~/components/Package/CodeBrowser/CodeBrowserContent';
import CodeBrowserContentFooter from '~/components/Package/CodeBrowser/CodeBrowserContentFooter';
import CodeBrowserFileTree from '~/components/Package/CodeBrowser/CodeBrowserFileTree';
import DetailsNavigation from '~/components/Package/DetailsNavigation';
import NotFound from '~/components/Package/NotFound';
import PackageHeader from '~/components/Package/PackageHeader';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import PageMeta from '~/components/PageMeta';
import { type UnpkgMeta } from '~/types';
import { type PackageCodePageProps } from '~/types/pages';
import { buildCodeBrowserFileTree, getCodeBrowserFilePath } from '~/util/codeBrowser';
import { TimeRange } from '~/util/datetime';
import { formatBytes } from '~/util/formatBytes';
import { pluralize } from '~/util/strings';
import tw from '~/util/tailwind';

export default function PackageCodeScene({ apiData, packageName }: PackageCodePageProps) {
  const { isSmallScreen } = useLayout();
  const inputRef = useRef<TextInput>(null);

  const [search, setSearch] = useState('');
  const [isInputFocused, setInputFocused] = useState(false);
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

  const normalizedSearch = useMemo(() => search.trim().toLowerCase(), [search]);

  const filteredFiles = useMemo(() => {
    const files = data?.files ?? [];

    if (!normalizedSearch) {
      return files;
    }

    return files.filter(file =>
      getCodeBrowserFilePath(file.path, data?.prefix).toLowerCase().includes(normalizedSearch)
    );
  }, [data?.files, data?.prefix, normalizedSearch]);

  const visibleFilePaths = useMemo(
    () => new Set(filteredFiles.map(file => getCodeBrowserFilePath(file.path, data?.prefix))),
    [filteredFiles, data?.prefix]
  );

  useEffect(() => {
    if (activeFile && !visibleFilePaths.has(activeFile)) {
      setActiveFile(null);
    }
  }, [activeFile, visibleFilePaths]);

  const fileTree = useMemo(
    () => buildCodeBrowserFileTree(filteredFiles, data?.prefix),
    [filteredFiles, data?.prefix]
  );

  const totalFilesSize = useMemo(
    () => filteredFiles.reduce((total, file) => total + (file.size ?? 0), 0),
    [filteredFiles]
  );

  const activeFileData = useMemo(
    () => data?.files.find(file => file.path === `${data.prefix}${activeFile}`),
    [data, activeFile]
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
          <PackageHeader library={library} skipDescription />
          <View
            id="codeBrowser"
            style={tw`mt-2 flex h-[70vh] overflow-hidden rounded-xl border border-palette-gray2 text-black dark:border-default dark:text-white`}>
            {isLoading && (
              <View style={tw`flex flex-1 items-center justify-center`}>
                <ThreeDotsLoader />
              </View>
            )}
            {!data && !isLoading && <P>Cannot fetch package bundle code.</P>}
            {data && !isLoading && (
              <View style={[tw`flex h-[70vh] flex-row`, isSmallScreen && tw`flex-col`]}>
                <View>
                  <View
                    style={[
                      tw`relative flex min-h-[45px] flex-row justify-between gap-3 border-b border-r border-palette-gray2 bg-default dark:border-default`,
                      isSmallScreen && tw`border-r-0`,
                    ]}>
                    <View style={tw`pointer-events-none absolute left-3.5 top-3.5`}>
                      <SearchIcon
                        style={[
                          tw`size-4`,
                          isInputFocused
                            ? tw`text-primary-darker dark:text-primary`
                            : tw`text-icon`,
                        ]}
                      />
                    </View>
                    <TextInput
                      ref={inputRef}
                      autoComplete="off"
                      onKeyPress={event => {
                        if ('key' in event) {
                          if (inputRef.current && event.key === 'Escape') {
                            if (search) {
                              event.preventDefault();
                              setSearch('');
                            } else {
                              inputRef.current.blur();
                            }
                          }
                        }
                      }}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      onChangeText={setSearch}
                      placeholder="Search files..."
                      style={[
                        tw`font-sans flex h-11 flex-1 rounded-none bg-white p-1 pl-10 text-sm text-black -outline-offset-2 dark:bg-dark dark:text-white`,
                        isSmallScreen ? tw`rounded-t-xl` : tw`rounded-tl-xl`,
                      ]}
                      value={search}
                      placeholderTextColor={tw`text-palette-gray4`.color as ColorValue}
                    />
                  </View>
                  <ScrollView
                    id="codeBrowserList"
                    style={[
                      tw`border-palette-gray2 dark:border-default`,
                      isSmallScreen
                        ? tw`h-[320px] flex-grow-0 border-b`
                        : tw`w-[320px] flex-grow border-r`,
                    ]}
                    contentContainerStyle={tw`pt-2`}>
                    {filteredFiles.length > 0 ? (
                      <>
                        <CodeBrowserFileTree
                          tree={fileTree}
                          activeFile={activeFile}
                          onSelectFile={setActiveFile}
                        />
                        <View style={tw`h-2`} />
                      </>
                    ) : (
                      <View style={tw`px-3 py-2`}>
                        <Label style={tw`text-center`}>No files match this search.</Label>
                      </View>
                    )}
                  </ScrollView>
                  {filteredFiles.length > 0 && (
                    <CodeBrowserContentFooter
                      style={isSmallScreen ? tw`border-r-0` : tw`border-r`}
                      leftSlot={
                        <Label style={tw`font-light text-secondary`}>
                          <span style={tw`font-medium`}>{filteredFiles.length}</span>{' '}
                          {pluralize('file', filteredFiles.length)}
                        </Label>
                      }
                      rightSlot={
                        <Label style={tw`font-light text-secondary`}>
                          <span style={tw`font-medium`}>{formatBytes(totalFilesSize)}</span>
                        </Label>
                      }
                    />
                  )}
                </View>
                <View
                  style={[
                    tw`flex flex-1`,
                    activeFile ? tw`bg-white dark:bg-[#0d1117]` : tw`items-center justify-center`,
                    isSmallScreen && tw`min-h-[50vh]`,
                  ]}>
                  {activeFile && activeFileData ? (
                    <CodeBrowserContent
                      packageName={packageName}
                      filePath={activeFile}
                      fileData={activeFileData}
                    />
                  ) : (
                    <View style={tw`flex flex-col items-center gap-1 px-3`}>
                      <FileIcon style={tw`mb-2 size-20 text-tertiary dark:text-accented`} />
                      <P style={tw`text-center`}>
                        Select file to preview from the list on the left.
                      </P>
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
