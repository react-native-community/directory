import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { H6 } from '~/common/styleguide';
import { Button } from '~/components/Button';
import ContentContainer from '~/components/ContentContainer';
import DetailsNavigation from '~/components/Package/DetailsNavigation';
import NotFound from '~/components/Package/NotFound';
import PackageHeader from '~/components/Package/PackageHeader';
import VersionBox from '~/components/Package/VersionBox';
import PageMeta from '~/components/PageMeta';
import { type PackageVersionsPageProps } from '~/types/pages';
import tw from '~/util/tailwind';

const VERSIONS_TO_SHOW = 25;

export default function PackageVersionsScene({
  apiData,
  registryData,
  packageName,
}: PackageVersionsPageProps) {
  const [shouldShowAll, setShowAll] = useState(false);

  const library = useMemo(
    () => apiData.libraries.find(lib => lib.npmPkg === packageName),
    [apiData.libraries, packageName]
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
      <ContentContainer style={tw`my-6 px-5 py-3`}>
        <View style={tw`flex-1 gap-3`}>
          <PackageHeader library={library} />
          <H6 style={tw`mt-3 text-secondary`}>Tagged versions</H6>
          <View style={tw`gap-2`}>
            {Object.entries(registryData['dist-tags'])
              .sort((a, b) => -registryData.time[a[1]].localeCompare(registryData.time[b[1]]))
              .map(([label, version]) => {
                return (
                  <VersionBox
                    key={label}
                    label={label}
                    time={registryData.time[version]}
                    versionData={registryData.versions[version]}
                  />
                );
              })}
          </View>
          <H6 style={tw`mt-3 text-secondary`}>Versions</H6>
          <View style={tw`gap-2`}>
            {Object.entries(registryData.versions)
              .sort(
                (a, b) =>
                  -registryData.time[a[1].version].localeCompare(registryData.time[b[1].version])
              )
              .slice(
                0,
                shouldShowAll ? Object.keys(registryData.versions).length : VERSIONS_TO_SHOW
              )
              .map(([version, versionData]) => {
                return (
                  <VersionBox
                    key={version}
                    time={registryData.time[versionData.version]}
                    versionData={versionData}
                  />
                );
              })}
          </View>
          <Button onPress={() => setShowAll(true)} style={tw`mx-auto mt-2 px-4 py-2`}>
            Show all versions
          </Button>
        </View>
      </ContentContainer>
    </>
  );
}
