import { NextPageContext } from 'next';
import * as emoji from 'node-emoji';
import { useContext } from 'react';
import { Linkify } from 'react-easy-linkify';
import { Platform, StyleSheet, View } from 'react-native';

import { A, colors, darkColors, H6, Headline, Label, P, useLayout } from '../../common/styleguide';
import { Button } from '../../components/Button';
import { CompatibilityTags } from '../../components/CompatibilityTags';
import ContentContainer from '../../components/ContentContainer';
import { MetaData } from '../../components/Library/MetaData';
import PopularityMark from '../../components/Library/PopularityMark';
import RecommendedLabel from '../../components/Library/RecommendedLabel';
import Thumbnail from '../../components/Library/Thumbnail';
import UnmaintainedLabel from '../../components/Library/UnmaintainedLabel';
import Navigation from '../../components/Navigation';
import { NotFoundContent } from '../../components/NotFoundContent';
import { PackageAuthor } from '../../components/PackageAuthor';
import PageMeta from '../../components/PageMeta';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Library as LibraryType } from '../../types';
import getApiUrl from '../../util/getApiUrl';
import { getExampleDescription, getLibraryDisplayName } from '../../util/strings';
import urlWithQuery from '../../util/urlWithQuery';

type Props = {
  data: {
    libraries: LibraryType[];
  };
  packageName: string;
};

export default function PackagePage({ data, packageName }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();

  const library = data.libraries.find(lib => lib.npmPkg === packageName);

  if (!library) {
    return (
      <>
        <Navigation noHeader />
        <ContentContainer>
          <NotFoundContent
            header="Nothing was found! Go back to the directory home."
            alt="No package"
            bottomSlot={
              <Button href="/" style={styles.homeButton}>
                Home
              </Button>
            }
          />
        </ContentContainer>
      </>
    );
  }

  const { author, contributors, dependencies, devDependencies, peerDependency } =
    library.github.packageJson;

  const headerColorStyle = {
    color: isDark ? darkColors.secondary : colors.gray5,
  };
  const mutedLinkHoverStyle = isDark && { color: colors.primaryDark };

  const libraryDisplayName = getLibraryDisplayName(library);

  return (
    <>
      <PageMeta
        title={`Package information: ${libraryDisplayName}`}
        description="See the detailed package information and metadata"
        path="package"
      />
      <Navigation title="Package information" />
      <ContentContainer style={styles.container}>
        <View style={styles.metaContainer}>
          <View style={styles.readmeContainer}>
            {library.unmaintained && <UnmaintainedLabel />}
            <View style={styles.nameWrapper}>
              <A
                href={library.githubUrl || library.github.urls.repo}
                style={styles.name}
                hoverStyle={styles.nameHovered}>
                {libraryDisplayName}
              </A>
              {library.goldstar && <RecommendedLabel isSmallScreen={isSmallScreen} />}
            </View>
            {library.github.description && library.github.description.length && (
              <Headline style={{ fontWeight: '400', lineHeight: 23, marginBottom: 8 }}>
                <Linkify
                  options={{
                    linkWrapper: props => <A {...props}>{props.children}</A>,
                  }}>
                  {emoji.emojify(library.github.description)}
                </Linkify>
              </Headline>
            )}
            <H6 style={[styles.mainContentHeader, headerColorStyle]}>Supported platforms</H6>
            <CompatibilityTags library={library} />
            <H6 style={[styles.mainContentHeader, headerColorStyle]}>Popularity</H6>
            <PopularityMark library={library} />
            {library.examples && library.examples.length ? (
              <>
                <H6 style={[styles.mainContentHeader, headerColorStyle]}>Code examples</H6>
                <View style={{ gap: 6, alignItems: 'flex-start' }}>
                  {library.examples.map((example, index) => (
                    <A
                      key={example}
                      href={example}
                      style={styles.mutedLink}
                      hoverStyle={mutedLinkHoverStyle}>
                      #{index + 1}: {getExampleDescription(example)}
                    </A>
                  ))}
                </View>
              </>
            ) : null}
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
            {author && (
              <>
                <H6 style={[styles.mainContentHeader, headerColorStyle]}>Author</H6>
                <View style={{ alignItems: 'flex-start' }}>
                  <PackageAuthor author={author} />
                </View>
              </>
            )}
            <H6 style={[styles.mainContentHeader, headerColorStyle]}>Additional information</H6>
            <View style={{ gap: 6 }}>
              <MetaData library={library} secondary skipExamples />
            </View>
          </View>
          <View style={styles.depsContainer}>
            <View>
              <MetaData library={library} />
            </View>
            {contributors && (
              <>
                <H6 style={[styles.contentHeader, headerColorStyle]}>Contributors</H6>
                <View style={{ gap: 8 }}>
                  {contributors.map(contributor => (
                    <PackageAuthor author={contributor} key={contributor} />
                  ))}
                </View>
              </>
            )}
            {dependencies && (
              <>
                <H6 style={[styles.contentHeader, headerColorStyle]}>Dependencies</H6>
                <View>
                  {Object.entries(dependencies).map(([name, version]: [string, string]) => (
                    <View key={`dep-${name}`} style={styles.dependencyEntry}>
                      <A
                        href={`https://www.npmjs.com/package/${name}`}
                        target="_blank"
                        style={[styles.dependencyLabel, styles.mutedLink]}
                        hoverStyle={mutedLinkHoverStyle}>
                        {name}
                      </A>
                      <Label style={headerColorStyle}>{version}</Label>
                    </View>
                  ))}
                </View>
              </>
            )}
            {devDependencies && (
              <>
                <H6 style={[styles.contentHeader, headerColorStyle]}>Development dependencies</H6>
                <View>
                  {Object.entries(devDependencies).map(([name, version]: [string, string]) => (
                    <View key={`dev-dep-${name}`} style={styles.dependencyEntry}>
                      <A
                        href={`https://www.npmjs.com/package/${name}`}
                        target="_blank"
                        style={[styles.dependencyLabel, styles.mutedLink]}
                        hoverStyle={mutedLinkHoverStyle}>
                        {name}
                      </A>
                      <Label style={headerColorStyle}>{version}</Label>
                    </View>
                  ))}
                </View>
              </>
            )}
            {peerDependency && (
              <>
                <H6 style={[styles.contentHeader, headerColorStyle]}>Peer dependencies</H6>
                <View>
                  {Object.entries(peerDependency).map(([name, version]: [string, string]) => (
                    <View key={`peer-dep-${name}`} style={styles.dependencyEntry}>
                      <A
                        href={`https://www.npmjs.com/package/${name}`}
                        target="_blank"
                        style={[styles.dependencyLabel, styles.mutedLink]}
                        hoverStyle={mutedLinkHoverStyle}>
                        {name}
                      </A>
                      <Label style={headerColorStyle}>{version}</Label>
                    </View>
                  ))}
                </View>
              </>
            )}
            {library.github.packageJson && library.github.packageJson.engines && (
              <>
                <H6 style={[styles.contentHeader, headerColorStyle]}>Engines</H6>
                <View>
                  {Object.entries(library.github.packageJson.engines).map(
                    ([name, version]: [string, string]) => (
                      <View key={`engines-${name}`} style={styles.dependencyEntry}>
                        <P style={styles.dependencyLabel}>{name}</P>
                        <Label style={headerColorStyle}>{version}</Label>
                      </View>
                    )
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </ContentContainer>
    </>
  );
}

PackagePage.getInitialProps = async (ctx: NextPageContext) => {
  const packageName = Array.isArray(ctx.query.name) ? ctx.query.name.join('/') : ctx.query.name;

  const url = getApiUrl(urlWithQuery(`/libraries?search=${encodeURI(packageName)}`, {}), ctx);

  const response = await fetch(url);
  const result = await response.json();

  return {
    data: result,
    packageName,
  };
};

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
  readmeContainer: {
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
  nameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    backgroundColor: 'transparent',
    fontWeight: '600',
    fontSize: 20,
    textDecorationLine: 'none',
  },
  nameHovered: {
    color: colors.gray4,
  },
  mutedLink: {
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
});
