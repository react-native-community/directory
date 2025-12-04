import { useContext, useMemo, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { colors, darkColors, H6 } from '~/common/styleguide';
import { Button } from '~/components/Button';
import ContentContainer from '~/components/ContentContainer';
import DetailsNavigation from '~/components/Package/DetailsNavigation';
import NotFound from '~/components/Package/NotFound';
import PackageHeader from '~/components/Package/PackageHeader';
import VersionBox from '~/components/Package/VersionBox';
import PageMeta from '~/components/PageMeta';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type PackageVersionsPageProps } from '~/types/pages';

const VERSIONS_TO_SHOW = 25;

export default function PackageVersionsScene({
  apiData,
  registryData,
  packageName,
}: PackageVersionsPageProps) {
  const { isDark } = useContext(CustomAppearanceContext);
  const [shouldShowAll, setShowAll] = useState(false);

  const library = useMemo(
    () => apiData.libraries.find(lib => lib.npmPkg === packageName),
    [apiData.libraries, packageName]
  );

  if (!library || !registryData) {
    return <NotFound />;
  }

  const headerColorStyle = {
    color: isDark ? darkColors.secondary : colors.gray5,
  };

  return (
    <>
      <PageMeta
        title={library.npmPkg}
        description={`See ${library.npmPkg} ${library.template ? 'template' : 'package'} published versions information and metadata`}
        path="package"
      />
      <DetailsNavigation library={library} />
      <ContentContainer style={styles.container}>
        <View style={styles.detailsContainer}>
          <PackageHeader library={library} />
          <H6 style={[styles.sectionHeader, headerColorStyle]}>Tagged versions</H6>
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
          <H6 style={[styles.sectionHeader, headerColorStyle]}>Versions</H6>
          {Object.entries(registryData.versions)
            .sort(
              (a, b) =>
                -registryData.time[a[1].version].localeCompare(registryData.time[b[1].version])
            )
            .slice(0, shouldShowAll ? Object.keys(registryData.versions).length : VERSIONS_TO_SHOW)
            .map(([version, versionData]) => {
              return (
                <VersionBox
                  key={version}
                  time={registryData.time[versionData.version]}
                  versionData={versionData}
                />
              );
            })}
          <Button onPress={() => setShowAll(true)} style={styles.showAllButton}>
            Show all versions
          </Button>
        </View>
      </ContentContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  detailsContainer: {
    gap: 12,
    ...Platform.select({
      web: {
        flex: 1,
      },
    }),
  },
  sectionHeader: {
    marginTop: 12,
  },
  showAllButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 'auto',
  },
});
