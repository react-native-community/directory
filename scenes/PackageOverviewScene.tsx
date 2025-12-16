import { UL } from '@expo/html-elements';
import dynamic from 'next/dynamic';
import { useContext, useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { A, colors, darkColors, H6, Label, P, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import MetaData from '~/components/Library/MetaData';
import TrendingMark from '~/components/Library/TrendingMark';
import UpdatedAtView from '~/components/Library/UpdateAtView';
import DependencyRow from '~/components/Package/DependencyRow';
import DetailsNavigation from '~/components/Package/DetailsNavigation';
import ExampleBox from '~/components/Package/ExampleBox';
import NotFound from '~/components/Package/NotFound';
import PackageAuthor from '~/components/Package/PackageAuthor';
import PackageHeader from '~/components/Package/PackageHeader';
import ReadmeBox from '~/components/Package/ReadmeBox';
import PageMeta from '~/components/PageMeta';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type NpmUser } from '~/types';
import { type PackageOverviewPageProps } from '~/types/pages';
import mapDependencies from '~/util/mapDependencies';

const ReadmeBoxWithLoading = dynamic(() => import('~/components/Package/ReadmeBox'), {
  loading: () => <ReadmeBox loader />,
});

export default function PackageOverviewScene({
  apiData,
  registryData,
  packageName,
}: PackageOverviewPageProps) {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();

  const library = useMemo(
    () => apiData.libraries.find(lib => lib.npmPkg === packageName),
    [apiData.libraries, packageName]
  );

  if (!library || !registryData) {
    return <NotFound />;
  }

  const { author, maintainers, dependencies, devDependencies, peerDependencies, engines } =
    registryData;

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
        <View style={[styles.metaContainer, isSmallScreen && styles.mobileMetaContainer]}>
          <View style={styles.detailsContainer}>
            <PackageHeader
              library={library}
              registryData={registryData}
              rightSlot={<UpdatedAtView library={library} />}
            />
            <ReadmeBoxWithLoading
              packageName={packageName}
              isTemplate={library.template ?? false}
              isDark={isDark}
              githubUrl={library.githubUrl}
            />
            {library.examples && library.examples.length > 0 && (
              <>
                <H6 style={[styles.mainContentHeader, headerColorStyle]}>Code examples</H6>
                <UL style={styles.examplesWrapper}>
                  {library.examples.map((example, index) => (
                    <ExampleBox example={example} key={example} index={index} />
                  ))}
                </UL>
              </>
            )}
            {!isSmallScreen && !!author && (
              <>
                <H6 style={[styles.mainContentHeader, headerColorStyle]}>Author</H6>
                <View style={{ alignItems: 'flex-start' }}>
                  {typeof author === 'string' ? (
                    <View>
                      <Label>{author ?? 'Unknown'}</Label>
                    </View>
                  ) : (
                    <PackageAuthor author={author} />
                  )}
                </View>
              </>
            )}
            {!isSmallScreen && maintainers && (
              <>
                <H6 style={[styles.mainContentHeader, headerColorStyle]}>Contributors</H6>
                <View style={styles.maintainersList}>
                  {maintainers
                    .sort((a: NpmUser, b: NpmUser) => a.name.localeCompare(b.name))
                    .map(maintainer => (
                      <PackageAuthor author={maintainer} key={maintainer.name} compact />
                    ))}
                </View>
              </>
            )}
          </View>
          <View style={styles.metadataContainer} id="metadataContainer">
            <View>
              <MetaData library={library} />
            </View>
            <H6 style={[styles.contentHeader, headerColorStyle]}>Additional information</H6>
            <View style={styles.rowSpacing}>
              <MetaData library={library} secondary skipExamples />
            </View>
            {!library.template && (
              <>
                <H6 style={[styles.mainContentHeader, headerColorStyle]}>Popularity</H6>
                <TrendingMark library={library} />
              </>
            )}
            {library.github.topics && library.github.topics.length > 0 && (
              <>
                <H6 style={[styles.contentHeader, headerColorStyle]}>Topics</H6>
                <View style={styles.topicsContainer}>
                  {library.github.topics.map(topic => (
                    <A
                      key={topic}
                      href={`/?search=${topic}`}
                      style={[styles.dependencyLabel, styles.mutedLink]}>
                      {topic}
                    </A>
                  ))}
                </View>
              </>
            )}
            {isSmallScreen && !!author && (
              <>
                <H6 style={[styles.contentHeader, headerColorStyle]}>Author</H6>
                <View style={{ alignItems: 'flex-start' }}>
                  {typeof author === 'string' ? (
                    <View>
                      <Label>{author ?? 'Unknown'}</Label>
                    </View>
                  ) : (
                    <PackageAuthor author={author} />
                  )}
                </View>
              </>
            )}
            {isSmallScreen && maintainers && (
              <>
                <H6 style={[styles.contentHeader, headerColorStyle]}>Contributors</H6>
                <View style={styles.maintainersList}>
                  {maintainers
                    .sort((a: NpmUser, b: NpmUser) => a.name.localeCompare(b.name))
                    .map(maintainer => (
                      <PackageAuthor author={maintainer} key={maintainer.name} compact />
                    ))}
                </View>
              </>
            )}
            {!library.template && (
              <>
                <H6 style={[styles.contentHeader, headerColorStyle]}>Package analysis</H6>
                <ul
                  style={{
                    ...styles.rowSpacing,
                    ...styles.linkList,
                    color: isDark ? colors.gray5 : colors.gray4,
                  }}>
                  <li>
                    <A
                      href={`https://bundlephobia.com/package/${library.npmPkg}`}
                      style={[styles.dependencyLabel, styles.mutedLink]}>
                      Bundlephobia
                    </A>
                  </li>
                  <li>
                    <A
                      href={`https://pkg-size.dev/${library.npmPkg}`}
                      style={[styles.dependencyLabel, styles.mutedLink]}>
                      pkg-size.dev
                    </A>
                  </li>
                  <li>
                    <A
                      href={`https://snyk.io/advisor/npm-package/${library.npmPkg}`}
                      style={[styles.dependencyLabel, styles.mutedLink]}>
                      Snyk Advisor
                    </A>
                  </li>
                </ul>
              </>
            )}
            {dependencies && Object.keys(dependencies).length > 0 && (
              <>
                <H6 style={[styles.contentHeader, headerColorStyle]}>Dependencies</H6>
                <View>
                  {mapDependencies(dependencies, ([name, version]: [string, string]) => (
                    <DependencyRow key={`dep-${name}`} name={name} version={version} />
                  ))}
                </View>
              </>
            )}
            {peerDependencies && Object.keys(peerDependencies).length > 0 && (
              <>
                <H6 style={[styles.contentHeader, headerColorStyle]}>Peer dependencies</H6>
                <View>
                  {mapDependencies(peerDependencies, ([name, version]: [string, string]) => (
                    <DependencyRow key={`peer-dep-${name}`} name={name} version={version} />
                  ))}
                </View>
              </>
            )}
            {devDependencies && Object.keys(devDependencies).length > 0 && (
              <>
                <H6 style={[styles.contentHeader, headerColorStyle]}>Development dependencies</H6>
                <View>
                  {mapDependencies(devDependencies, ([name, version]: [string, string]) => (
                    <DependencyRow key={`dev-dep-${name}`} name={name} version={version} />
                  ))}
                </View>
              </>
            )}
            {engines && Object.keys(engines).length > 0 && (
              <>
                <H6 style={[styles.contentHeader, headerColorStyle]}>Engines</H6>
                <View>
                  {mapDependencies(engines, ([name, version]: [string, string]) => (
                    <View key={`engines-${name}`} style={styles.dependencyEntry}>
                      <P style={styles.dependencyLabel}>{name}</P>
                      <Label style={headerColorStyle}>{version}</Label>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
      </ContentContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
  },
  metaContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 32,
  },
  mobileMetaContainer: {
    flexDirection: 'column',
    gap: 20,
  },
  detailsContainer: {
    gap: 12,
    ...Platform.select({
      web: {
        flex: 1,
      },
    }),
  },
  metadataContainer: {
    gap: 16,
    ...Platform.select({
      web: {
        flex: 0.35,
      },
    }),
  },
  contentHeader: {
    fontSize: 16,
  },
  mainContentHeader: {
    fontSize: 16,
    marginTop: 12,
  },
  mutedLink: {
    fontWeight: 300,
    backgroundColor: 'transparent',
  },
  dependencyEntry: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    fontFamily: 'monospace',
  },
  dependencyLabel: {
    fontSize: 12,
  },
  maintainersList: {
    gap: 8,
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  readmeWrapper: {
    padding: 16,
    paddingTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  rowSpacing: {
    gap: 6,
  },
  examplesWrapper: {
    marginBlock: 0,
    marginBottom: 8,
    gap: 8,
  },
  topicsContainer: {
    columnGap: 8,
    rowGap: 2,
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  linkList: {
    margin: 0,
    paddingLeft: 18,
    fontSize: 13,
  },
});
