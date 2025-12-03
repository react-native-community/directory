import * as emoji from 'node-emoji';
import { useContext, useMemo, useState } from 'react';
import { Linkify } from 'react-easy-linkify';
import { Platform, StyleSheet, View } from 'react-native';

import {
  A,
  colors,
  darkColors,
  H6,
  Headline,
  HoverEffect,
  P,
  useLayout,
} from '~/common/styleguide';
import Avatar from '~/components/Avatar';
import { Button } from '~/components/Button';
import { CompatibilityTags } from '~/components/CompatibilityTags';
import ContentContainer from '~/components/ContentContainer';
import DetailsNavigation from '~/components/Details/DetailsNavigation';
import NotFound from '~/components/Details/NotFound';
import VersionBox from '~/components/Details/VersionBox';
import { GitHub } from '~/components/Icons';
import UnmaintainedLabel from '~/components/Library/UnmaintainedLabel';
import PageMeta from '~/components/PageMeta';
import Tooltip from '~/components/Tooltip';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type PackageVersionsPageProps } from '~/types/pages';

const VERSIONS_TO_SHOW = 25;

export default function PackageVersionsPage({
  apiData,
  registryData,
  packageName,
}: PackageVersionsPageProps) {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();
  const [shouldShowAll, setShowAll] = useState(false);

  const library = useMemo(
    () => apiData.libraries.find(lib => lib.npmPkg === packageName),
    [apiData.libraries, packageName]
  );

  if (!library || !registryData) {
    return <NotFound />;
  }

  const ghUsername = library.github.fullName.split('/')[0];

  const headerColorStyle = {
    color: isDark ? darkColors.secondary : colors.gray5,
  };

  return (
    <>
      <PageMeta
        title={library.npmPkg}
        description={`See ${library.npmPkg} ${library.template ? 'template' : 'package'} detailed information and metadata`}
        path="package"
      />
      <DetailsNavigation library={library} />
      <ContentContainer style={styles.container}>
        <View style={styles.detailsContainer}>
          {library.unmaintained && <UnmaintainedLabel block />}
          <View style={[styles.nameRow, isSmallScreen && styles.nameRowMobile]}>
            <View style={styles.nameWrapper}>
              <Tooltip
                sideOffset={2}
                delayDuration={100}
                trigger={
                  <Avatar
                    src={`https://github.com/${ghUsername}.png`}
                    style={{
                      ...styles.avatar,
                      borderColor: isDark ? darkColors.border : colors.gray2,
                    }}
                    alt={`${ghUsername} avatar`}
                  />
                }>
                {ghUsername}
              </Tooltip>
              <P style={styles.name}>{library.npmPkg}</P>
              <HoverEffect>
                <A href={library.githubUrl} style={styles.githubButton}>
                  <GitHub width={20} height={20} fill={isDark ? colors.gray4 : colors.gray5} />
                </A>
              </HoverEffect>
            </View>
          </View>
          <CompatibilityTags library={library} />
          {library.github.description && library.github.description.length && (
            <Headline style={styles.description}>
              <Linkify
                options={{
                  linkWrapper: props => <A {...props}>{props.children}</A>,
                }}>
                {emoji.emojify(library.github.description)}
              </Linkify>
            </Headline>
          )}
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
  nameRow: {
    gap: 24,
    minHeight: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameRowMobile: {
    gap: 8,
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  nameWrapper: {
    columnGap: 8,
    rowGap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: {
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 26,
    marginTop: -2,
  },
  githubButton: {
    width: 20,
    height: 20,
  },
  description: {
    fontWeight: '400',
    lineHeight: 23,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'solid',
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
