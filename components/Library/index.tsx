import * as emoji from 'node-emoji';
import { useContext } from 'react';
import { Linkify } from 'react-easy-linkify';
import { Platform, StyleSheet, View } from 'react-native';

import { colors, useLayout, A, darkColors, Headline } from '~/common/styleguide';
import UpdatedAtView from '~/components/Library/UpdateAtView';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { Library as LibraryType } from '~/types';

import { MetaData } from './MetaData';
import Thumbnail from './Thumbnail';
import TrendingMark from './TrendingMark';
import UnmaintainedLabel from './UnmaintainedLabel';
import { CompatibilityTags } from '../CompatibilityTags';
import Tooltip from '../Tooltip';

type Props = {
  library: LibraryType;
  skipMetadata?: boolean;
  showTrendingMark?: boolean;
};

const Library = ({ library, skipMetadata, showTrendingMark }: Props) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const { github } = library;
  const { isSmallScreen, isBelowMaxWidth } = useLayout();

  const libName = library.npmPkg ?? github.name;
  const hasSecondaryMetadata =
    github.license ||
    github.urls.homepage ||
    github.newArchitecture ||
    library.newArchitecture ||
    (library.examples && library.examples.length);

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isDark ? darkColors.border : colors.gray2,
        },
        isSmallScreen && styles.containerColumn,
        skipMetadata && styles.noMetaContainer,
        skipMetadata && (isSmallScreen || isBelowMaxWidth) && styles.noMetaColumnContainer,
        library.unmaintained && styles.unmaintained,
      ]}>
      <View style={styles.columnOne}>
        {library.unmaintained && (
          <View
            style={
              isSmallScreen
                ? [
                    styles.containerColumn,
                    styles.updatedAtContainerSmall,
                    { marginBottom: 6, gap: 0 },
                  ]
                : [styles.updatedAtContainer, styles.trendingMarkContainer]
            }>
            <UnmaintainedLabel alternatives={library.alternatives} />
            <UpdatedAtView library={library} />
          </View>
        )}
        {showTrendingMark && library.popularity && (
          <View
            style={
              isSmallScreen
                ? [styles.containerColumn, styles.updatedAtContainerSmall]
                : [styles.updatedAtContainer, { marginBottom: 4 }]
            }>
            <Tooltip sideOffset={8} trigger={<TrendingMark library={library} />}>
              Trending Score is based on the last week to last month download rate.
            </Tooltip>
            {!library.unmaintained && <UpdatedAtView library={library} />}
          </View>
        )}
        <View
          style={
            isSmallScreen
              ? [styles.containerColumn, styles.updatedAtContainerSmall]
              : styles.updatedAtContainer
          }>
          <A
            href={library.githubUrl || github.urls.repo}
            style={styles.name}
            hoverStyle={{ color: isDark ? colors.gray3 : colors.gray5 }}>
            {libName}
          </A>
          {!showTrendingMark && !library.unmaintained && <UpdatedAtView library={library} />}
        </View>
        <View style={styles.verticalMargin}>
          <CompatibilityTags library={library} />
        </View>
        {github.description && github.description.length && (
          <View style={styles.verticalMargin}>
            <Headline numberOfLines={skipMetadata && 3} style={{ fontWeight: 300, lineHeight: 23 }}>
              <Linkify
                options={{
                  linkWrapper: ({ children, ...rest }) => <A {...rest}>{children}</A>,
                }}>
                {emoji.emojify(github.description)}
              </Linkify>
            </Headline>
          </View>
        )}
        {!skipMetadata && Platform.OS === 'web' && library.images && library.images.length ? (
          <View style={[styles.displayHorizontal, styles.imagesContainer]}>
            {library.images.map((image, index) => (
              <Thumbnail key={`${image}-${index}`} url={image} />
            ))}
          </View>
        ) : null}
        {hasSecondaryMetadata ? (
          <>
            {isSmallScreen ? null : <View style={styles.filler} />}
            <View style={[styles.bottomBar, isSmallScreen ? styles.bottomBarSmall : {}]}>
              <View style={[styles.displayHorizontal, styles.secondaryStats]}>
                <MetaData library={library} secondary />
              </View>
            </View>
          </>
        ) : null}
      </View>
      {skipMetadata ? null : (
        <View
          style={[
            styles.columnTwo,
            {
              borderLeftColor: isDark ? darkColors.border : colors.gray2,
            },
            isSmallScreen && styles.columnTwoSmall,
            isSmallScreen
              ? {
                  borderTopColor: isDark ? darkColors.border : colors.gray2,
                }
              : undefined,
          ]}>
          <MetaData library={library} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  containerColumn: {
    flexDirection: 'column',
  },
  columnOne: {
    ...Platform.select({
      web: {
        flex: 1,
      },
    }),
    padding: 16,
    paddingLeft: 20,
  },
  columnTwo: {
    ...Platform.select({
      web: {
        flex: 0.35,
      },
    }),
    padding: 16,
    paddingLeft: 18,
    borderLeftWidth: 1,
  },
  columnTwoSmall: {
    borderLeftWidth: 0,
    borderTopWidth: 1,
  },
  name: {
    backgroundColor: 'transparent',
    fontWeight: 700,
    fontSize: 19,
    textDecorationLine: 'none',
  },
  displayHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exampleLink: {
    marginRight: 6,
  },
  recommendedContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 2,
    marginLeft: 10,
    top: 1,
  },
  recommendedContainerSmall: {
    marginLeft: 0,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  recommendedTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedText: {
    marginLeft: 6,
  },
  verticalMargin: {
    marginTop: 12,
  },
  imagesContainer: {
    flexWrap: 'wrap',
    marginTop: 8,
  },
  secondaryStats: {
    marginTop: 6,
    flexWrap: 'wrap',
  },
  secondaryText: {
    fontSize: 13,
    color: colors.gray5,
  },
  bottomBar: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    minHeight: 42,
    paddingLeft: 20,
    paddingRight: 16,
  },
  bottomBarSmall: {
    position: 'relative',
    minHeight: 'auto',
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: 6,
    marginBottom: -4,
  },
  filler: {
    flex: 1,
    paddingBottom: 34,
  },
  noMetaContainer: {
    width: '48.5%',
    marginHorizontal: '0.75%',
    minHeight: 206,
  },
  noMetaColumnContainer: {
    maxHeight: 'auto',
    width: '98.5%',
    maxWidth: '98.5%',
  },
  unmaintained: {
    opacity: 0.88,
  },
  trendingMarkContainer: {
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  link: {
    fontSize: 13,
    fontWeight: 300,
    backgroundColor: 'transparent',
  },
  updatedAtContainer: {
    gap: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  updatedAtContainerSmall: {
    gap: 8,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
});

export default Library;
