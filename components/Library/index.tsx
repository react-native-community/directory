import { useContext } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { colors, useLayout, A, darkColors, HoverEffect } from '~/common/styleguide';
import { GitHub } from '~/components/Icons';
import LibraryDescription from '~/components/Library/LibraryDescription';
import UpdatedAtView from '~/components/Library/UpdateAtView';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type LibraryType } from '~/types';

import { MetaData } from './MetaData';
import Thumbnail from './Thumbnail.web';
import TrendingMark from './TrendingMark';
import UnmaintainedLabel from './UnmaintainedLabel';
import { CompatibilityTags } from '../CompatibilityTags';
import Tooltip from '../Tooltip';

type Props = {
  library: LibraryType;
  skipMetadata?: boolean;
  showTrendingMark?: boolean;
};

export default function Library({ library, skipMetadata, showTrendingMark }: Props) {
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
      <View style={[styles.columnOne, styles.columnDesktop]}>
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
          <View style={styles.nameWrapper}>
            <A
              href={`/package/${library.npmPkg}`}
              style={styles.name}
              hoverStyle={{ color: isDark ? colors.gray3 : colors.gray5 }}>
              {libName}
            </A>
            <HoverEffect>
              <A href={library.githubUrl} style={styles.githubButton}>
                <GitHub width={20} height={20} fill={isDark ? colors.gray4 : colors.gray5} />
              </A>
            </HoverEffect>
          </View>
          {!showTrendingMark && !library.unmaintained && <UpdatedAtView library={library} />}
        </View>
        <View style={styles.verticalMargin}>
          <CompatibilityTags library={library} />
        </View>
        <View style={styles.verticalMargin}>
          <LibraryDescription github={library.github} maxLines={skipMetadata ? 3 : undefined} />
        </View>
        {!skipMetadata && Platform.OS === 'web' && library.images && library.images.length ? (
          <View style={[styles.displayHorizontal, styles.imagesContainer]}>
            {library.images.map((image, index) => (
              <Thumbnail key={`${image}-${index}`} url={image} />
            ))}
          </View>
        ) : null}
        {hasSecondaryMetadata ? (
          <View style={[styles.bottomBar, isSmallScreen ? styles.bottomBarSmall : {}]}>
            <View style={[styles.displayHorizontal, styles.secondaryStats]}>
              <MetaData library={library} secondary />
            </View>
          </View>
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
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  containerColumn: {
    flexDirection: 'column',
  },
  columnDesktop: {
    paddingBottom: 14,
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
    borderLeftWidth: 1,
  },
  columnTwoSmall: {
    borderLeftWidth: 0,
    borderTopWidth: 1,
  },
  nameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    rowGap: 2,
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
    marginTop: 12,
    flexWrap: 'wrap',
    gap: 10,
  },
  secondaryText: {
    fontSize: 13,
    color: colors.gray5,
  },
  bottomBar: {
    width: '100%',
    marginTop: 'auto',
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
  detailsButton: {
    display: 'flex',
    width: 16,
    height: 16,
    alignItems: 'center',
  },
  githubButton: {
    width: 20,
    height: 20,
  },
});
