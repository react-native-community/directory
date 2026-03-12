import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { Caption, H6, Label, useLayout } from '~/common/styleguide';
import { Button } from '~/components/Button';
import ContentContainer from '~/components/ContentContainer';
import DetailsNavigation from '~/components/Package/DetailsNavigation';
import NotFound from '~/components/Package/NotFound';
import PackageHeader from '~/components/Package/PackageHeader';
import VersionBox from '~/components/Package/VersionBox';
import VersionDownloadsChart from '~/components/Package/VersionDownloadsChart';
import PageMeta from '~/components/PageMeta';
import { type PackageVersionsPageProps } from '~/types/pages';
import tw from '~/util/tailwind';

const VERSIONS_TO_SHOW = 25;

export default function PackageVersionsScene({
  apiData,
  registryData,
  packageName,
  npmDownloads,
}: PackageVersionsPageProps) {
  const { isSmallScreen } = useLayout();
  const [shouldShowAll, setShowAll] = useState(false);

  const library = useMemo(
    () => apiData.libraries.find(lib => lib.npmPkg === packageName),
    [apiData.libraries, packageName]
  );

  const versions = useMemo(
    () =>
      Object.entries(registryData?.versions ?? {}).sort(
        (a, b) => -registryData!.time[a[1].version].localeCompare(registryData!.time[b[1].version])
      ),
    [registryData]
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
        description={`See ${library.npmPkg} ${library.template ? 'template' : 'package'} published versions information and metadata`}
        path="package"
      />
      <DetailsNavigation library={library} />
      <ContentContainer style={tw`my-6 px-5 py-3`}>
        <View style={tw`flex-1 gap-3`}>
          <PackageHeader library={library} />
          {hasVersionDownloads && npmDownloads ? (
            <>
              <View style={tw`mt-3 gap-1`}>
                <H6
                  style={[
                    tw`flex items-center justify-between text-secondary`,
                    isSmallScreen && tw`flex-col items-start gap-y-0.5`,
                  ]}>
                  Downloads by version
                  <Label style={tw`font-light text-secondary`}>
                    Last week&ensp;·&ensp;Top downloaded versions
                  </Label>
                </H6>
              </View>
              <View style={tw`overflow-hidden rounded-lg border border-default p-3`}>
                <VersionDownloadsChart npmDownloads={npmDownloads} registryData={registryData} />
              </View>
            </>
          ) : null}
          <H6 style={tw`mt-3 text-secondary`}>Tagged versions</H6>
          <View style={tw`gap-2`}>
            {taggedVersions.map(([label, versionData]) => {
              return (
                <VersionBox
                  key={label}
                  label={label}
                  time={registryData.time[versionData]}
                  versionData={registryData.versions[versionData]}
                  downloads={npmDownloads?.downloads[versionData]}
                />
              );
            })}
          </View>
          <H6 style={tw`mt-3 text-secondary`}>Versions</H6>
          <View style={tw`gap-2`}>
            {versions
              .slice(0, shouldShowAll ? versions.length : VERSIONS_TO_SHOW)
              .map(([version, versionData]) => {
                return (
                  <VersionBox
                    key={version}
                    time={registryData.time[versionData.version]}
                    versionData={versionData}
                    downloads={npmDownloads?.downloads[versionData.version]}
                  />
                );
              })}
          </View>
          {!shouldShowAll && versions.length > VERSIONS_TO_SHOW ? (
            <Button onPress={() => setShowAll(true)} style={tw`mx-auto mt-2 px-4 py-2`}>
              <Caption style={tw`text-white`}>Show all versions</Caption>
            </Button>
          ) : null}
        </View>
      </ContentContainer>
    </>
  );
}
