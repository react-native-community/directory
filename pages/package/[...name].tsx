import { UL } from '@expo/html-elements';
import { type NextPageContext } from 'next';
import dynamic from 'next/dynamic';
import * as emoji from 'node-emoji';
import { useContext, useMemo } from 'react';
import { Linkify } from 'react-easy-linkify';
import { Platform, StyleSheet, View } from 'react-native';

import {
  A,
  colors,
  darkColors,
  H6,
  Headline,
  HoverEffect,
  Label,
  P,
  useLayout,
} from '~/common/styleguide';
import { Button } from '~/components/Button';
import { CompatibilityTags } from '~/components/CompatibilityTags';
import ContentContainer from '~/components/ContentContainer';
import DependencyRow from '~/components/Details/DependencyRow';
import ExampleBox from '~/components/Details/ExampleBox';
import PackageAuthor from '~/components/Details/PackageAuthor';
import ReadmeBox from '~/components/Details/ReadmeBox';
import { GitHub } from '~/components/Icons';
import { MetaData } from '~/components/Library/MetaData';
import Thumbnail from '~/components/Library/Thumbnail.web';
import TrendingMark from '~/components/Library/TrendingMark';
import UnmaintainedLabel from '~/components/Library/UnmaintainedLabel';
import UpdatedAtView from '~/components/Library/UpdateAtView';
import Navigation from '~/components/Navigation';
import NotFoundContent from '~/components/NotFoundContent';
import PageMeta from '~/components/PageMeta';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type LibraryType, type NpmLatestRegistryData, type NpmUser } from '~/types';
import getApiUrl from '~/util/getApiUrl';
import mapDependencies from '~/util/mapDependencies';
import urlWithQuery from '~/util/urlWithQuery';

type Props = {
  packageName: string;
  apiData: {
    libraries: LibraryType[];
  };
  registryData?: NpmLatestRegistryData;
};

// TODO: async render/data fetch
export default function PackagePage({ apiData, registryData, packageName }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();

  const library = useMemo(
    () => apiData.libraries.find(lib => lib.npmPkg === packageName),
    [apiData.libraries, packageName]
  );

  if (!library || !registryData) {
    return (
      <>
        <Navigation />
        <ContentContainer>
          <NotFoundContent
            header="Nothing was found! Go back to the directory home."
            alt="No package"
            bottomSlot={
              <Button href="/" style={styles.homeButton}>
                Go back Home
              </Button>
            }
          />
        </ContentContainer>
      </>
    );
  }

  const { author, maintainers, dependencies, devDependencies, peerDependencies, engines } =
    registryData;

  const headerColorStyle = {
    color: isDark ? darkColors.secondary : colors.gray5,
  };

  return (
    <>
      <PageMeta
        title={`Package details: ${library.npmPkg}`}
        description={`See ${library.npmPkg} the detailed information and metadata`}
        path="package"
      />
      <Navigation title="Package information" />
      <ContentContainer style={styles.container}>
        <View style={[styles.metaContainer, isSmallScreen && styles.mobileMetaContainer]}>
          <View style={styles.detailsContainer}>
            {library.unmaintained && <UnmaintainedLabel block />}
            <View style={[styles.nameRow, isSmallScreen && styles.nameRowMobile]}>
              <View style={styles.nameWrapper}>
                <P style={styles.name}>{library.npmPkg}</P>
                <P style={headerColorStyle}>{library.npm?.latestRelease ?? registryData.version}</P>
                <HoverEffect>
                  <A href={library.githubUrl} style={styles.githubButton}>
                    <GitHub width={20} height={20} fill={isDark ? colors.gray4 : colors.gray5} />
                  </A>
                </HoverEffect>
              </View>
              <UpdatedAtView library={library} />
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
            <ReadmeBoxWithLoading
              packageName={packageName}
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
            {!isSmallScreen && author && (
              <>
                <H6 style={[styles.mainContentHeader, headerColorStyle]}>Author</H6>
                <View style={{ alignItems: 'flex-start' }}>
                  <PackageAuthor author={author} />
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
            {library.images && library.images.length ? (
              <>
                <H6 style={[styles.mainContentHeader, headerColorStyle]}>Usage gallery</H6>
                <View style={styles.galleryWrapper}>
                  {library.images.map((image, index) => (
                    <Thumbnail key={`${image}-${index}`} url={image} />
                  ))}
                </View>
              </>
            ) : null}
          </View>
          <View style={styles.depsContainer}>
            <View>
              <MetaData library={library} />
            </View>
            <H6 style={[styles.contentHeader, headerColorStyle]}>Additional information</H6>
            <View style={styles.rowSpacing}>
              <MetaData library={library} secondary skipExamples />
            </View>
            <H6 style={[styles.mainContentHeader, headerColorStyle]}>Popularity</H6>
            <TrendingMark library={library} />
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
            {isSmallScreen && author && (
              <>
                <H6 style={[styles.contentHeader, headerColorStyle]}>Author</H6>
                <View style={{ alignItems: 'flex-start' }}>
                  <PackageAuthor author={author} />
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
            <H6 style={[styles.contentHeader, headerColorStyle]}>Package analysis</H6>
            <View style={styles.rowSpacing}>
              <A
                href={`https://bundlephobia.com/package/${library.npmPkg}`}
                style={[styles.dependencyLabel, styles.mutedLink]}>
                Bundlephobia
              </A>
              <A
                href={`https://snyk.io/advisor/npm-package/${library.npmPkg}`}
                style={[styles.dependencyLabel, styles.mutedLink]}>
                Snyk Advisor
              </A>
            </View>
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

const ReadmeBoxWithLoading = dynamic(() => import('~/components/Details/ReadmeBox'), {
  loading: () => <ReadmeBox loader />,
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
  },
  homeButton: {
    marginVertical: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  metaContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 40,
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
  depsContainer: {
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
  galleryWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameRow: {
    gap: 24,
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
    lineHeight: 24,
    marginTop: -2,
  },
  githubButton: {
    width: 20,
    height: 20,
  },
  description: {
    fontWeight: '400',
    lineHeight: 23,
    marginBottom: 8,
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
    gap: 8,
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export async function getServerSideProps(ctx: NextPageContext) {
  const packageName = Array.isArray(ctx.query.name) ? ctx.query.name.join('/') : ctx.query.name;

  if (!packageName) {
    return {
      props: {
        data: {},
        packageName,
      },
    };
  }

  const apiResponse = await fetch(
    getApiUrl(urlWithQuery(`/libraries?search=${encodeURI(packageName)}`, {}), ctx)
  );
  const apiData = await apiResponse.json();

  const npmResponse = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
  const registryData = await npmResponse.json();

  return {
    props: {
      packageName,
      apiData,
      registryData,
    },
  };
}
