import dynamic from 'next/dynamic';
import { View } from 'react-native';

import { H6Section } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import ChartSectionHeader from '~/components/Package/Charts/ChartSectionHeader';
import DetailsNavigation from '~/components/Package/DetailsNavigation';
import NotFound from '~/components/Package/NotFound';
import PackageHeader from '~/components/Package/PackageHeader';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import VersionBox from '~/components/Package/VersionBox';
import { VersionSizeIncreasedBanner } from '~/components/Package/VersionSizeIncreasedBanner';
import VersionsSection from '~/components/Package/VersionsSection';
import PageMeta from '~/components/PageMeta';
import { type PackageVersionsPageProps } from '~/types/pages';
import tw from '~/util/tailwind';

const VersionDownloadsChartWithLoading = dynamic(
  () => import('~/components/Package/Charts/VersionDownloadsChart'),
  {
    ssr: false,
    loading: () => (
      <View style={tw`min-h-[406px] items-center justify-center`}>
        <ThreeDotsLoader />
      </View>
    ),
  }
);

const VersionSizeChartWithLoading = dynamic(
  () => import('~/components/Package/Charts/VersionSizeChart'),
  {
    ssr: false,
    loading: () => (
      <View style={tw`min-h-[280px] items-center justify-center`}>
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
  const library = apiData.libraries.find(lib => lib.npmPkg === packageName);
  const taggedVersions = Object.entries(registryData?.['dist-tags'] ?? {}).sort(
    (a, b) => -registryData!.time[a[1]].localeCompare(registryData!.time[b[1]])
  );

  const hasVersionDownloads = Boolean(
    npmDownloads && Object.values(npmDownloads.downloads).some(downloads => downloads > 0)
  );
  const hasVersionSizes = Boolean(
    registryData &&
    Object.values(registryData.versions).some(
      versionData => typeof versionData.dist?.unpackedSize === 'number'
    )
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
          <VersionSizeIncreasedBanner data={registryData} />
          {hasVersionDownloads && npmDownloads && (
            <>
              <ChartSectionHeader
                title="Downloads by version"
                description={['Last week', 'Top downloaded']}
              />
              <View style={tw`overflow-hidden rounded-lg border border-default p-3`}>
                <VersionDownloadsChartWithLoading
                  npmDownloads={npmDownloads}
                  registryData={registryData}
                />
              </View>
            </>
          )}
          {hasVersionSizes && (
            <>
              <ChartSectionHeader
                title="Package size by version"
                description={['Last published', 'No pre-release versions']}
              />
              <View style={tw`overflow-hidden rounded-lg border border-default p-3`}>
                <VersionSizeChartWithLoading registryData={registryData} />
              </View>
            </>
          )}
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
