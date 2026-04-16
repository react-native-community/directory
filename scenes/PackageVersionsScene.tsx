import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { View } from 'react-native';

import { H6Section, Label, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import DetailsNavigation from '~/components/Package/DetailsNavigation';
import NotFound from '~/components/Package/NotFound';
import PackageHeader from '~/components/Package/PackageHeader';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import VersionBox from '~/components/Package/VersionBox';
import VersionsSection from '~/components/Package/VersionsSection';
import PageMeta from '~/components/PageMeta';
import { type PackageVersionsPageProps } from '~/types/pages';
import tw from '~/util/tailwind';

const VersionDownloadsChartWithLoading = dynamic(
  () => import('~/components/Package/VersionDownloadsChart'),
  {
    ssr: false,
    loading: () => (
      <View style={tw`min-h-12 items-center justify-center`}>
        <ThreeDotsLoader />
      </View>
    ),
  }
);

export default function PackageVersionsScene({
  apiData,
  registryData,
  packageName,
  npmDownloads,
}: PackageVersionsPageProps) {
  const { isSmallScreen } = useLayout();

  const library = useMemo(
    () => apiData.libraries.find(lib => lib.npmPkg === packageName),
    [apiData.libraries, packageName]
  );

  const taggedVersions = useMemo(
    () =>
      Object.entries(registryData?.['dist-tags'] ?? {}).sort(
        (a, b) => -registryData!.time[a[1]].localeCompare(registryData!.time[b[1]])
      ),
    [registryData]
  );

  const hasVersionDownloads = Boolean(
    npmDownloads && Object.values(npmDownloads.downloads).some(downloads => downloads > 0)
  );

  if (!library || !registryData) {
    return <NotFound />;
  }

  return (
    <>
      <PageMeta
        title={library.npmPkg}
        description={`See ${library.npmPkg} package published versions information and metadata`}
        path="package"
      />
      <DetailsNavigation library={library} />
      <ContentContainer style={tw`my-6 px-5 pb-3`}>
        <View style={tw`flex-1 gap-3`}>
          <PackageHeader library={library} skipDescription />
          {hasVersionDownloads && npmDownloads ? (
            <>
              <View style={tw`mt-3 gap-1`}>
                <H6Section
                  style={[
                    tw`flex items-center justify-between text-secondary`,
                    isSmallScreen && tw`flex-col items-start gap-y-0.5`,
                  ]}>
                  Downloads by version
                  <Label style={tw`font-light text-secondary`}>
                    Last week&ensp;·&ensp;Top downloaded versions
                  </Label>
                </H6Section>
              </View>
              <View style={tw`overflow-hidden rounded-lg border border-default p-3`}>
                <VersionDownloadsChartWithLoading
                  npmDownloads={npmDownloads}
                  registryData={registryData}
                />
              </View>
            </>
          ) : null}
          <H6Section style={tw`mt-3 text-secondary`}>Tagged versions</H6Section>
          <View style={tw`gap-2`}>
            {taggedVersions.map(([label, versionData]) => (
              <VersionBox
                key={label}
                label={label}
                time={registryData.time[versionData]}
                versionData={registryData.versions[versionData]}
                downloads={npmDownloads?.downloads[versionData]}
              />
            ))}
          </View>
          <VersionsSection registryData={registryData} npmDownloads={npmDownloads} />
        </View>
      </ContentContainer>
    </>
  );
}
