import emoji from 'node-emoji';
import React, { useContext } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Linkify from 'react-simple-linkify';

import { colors, useLayout, A, Caption, darkColors } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Library as LibraryType } from '../../types';
import { isEmptyOrNull } from '../../util/strings';
import { CompatibilityTags } from '../CompatibilityTags';
import { MetaData } from './MetaData';
import PopularityMark from './PopularityMark';
import RecommendedLabel from './RecommendedLabel';
import Thumbnail from './Thumbnail';
import UnmaintainedLabel from './UnmaintainedLabel';

type Props = {
  library: LibraryType;
  skipMeta?: boolean;
  showPopularity?: boolean;
};

const Library = ({ library, skipMeta, showPopularity }: Props) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const { github } = library;
  const { isSmallScreen, isBelowMaxWidth } = useLayout();
  const libName = library.nameOverride || library.npmPkg || github.name;

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isDark ? darkColors.border : colors.gray2,
        },
        isSmallScreen && styles.containerColumn,
        skipMeta && styles.noMetaContainer,
        skipMeta && (isSmallScreen || isBelowMaxWidth) && styles.noMetaColumnContainer,
      ]}>
      <View style={styles.columnOne}>
        {library.unmaintained ? <UnmaintainedLabel /> : null}
        {showPopularity && library.popularity ? <PopularityMark library={library} /> : null}
        <View style={isSmallScreen ? styles.containerColumn : styles.displayHorizontal}>
          <A
            href={library.githubUrl || github.urls.repo}
            style={styles.name}
            hoverStyle={styles.nameHovered}>
            {libName}
          </A>
          {library.goldstar && <RecommendedLabel isSmallScreen={isSmallScreen} />}
        </View>
        <View style={styles.verticalMargin}>
          <CompatibilityTags library={library} />
        </View>
        {!isEmptyOrNull(github.description) && (
          <View style={styles.verticalMargin}>
            <Caption numberOfLines={skipMeta && 3}>
              <Linkify component={({ url }) => <A href={url}>{url}</A>}>
                {emoji.emojify(github.description)}
              </Linkify>
            </Caption>
          </View>
        )}
        {!skipMeta && Platform.OS === 'web' && library.images && library.images.length ? (
          <View style={[styles.displayHorizontal, styles.imagesContainer]}>
            {library.images.map((image, index) => (
              <Thumbnail key={`${image}-${index}`} url={image} />
            ))}
          </View>
        ) : null}
        {github.license || github.urls.homepage || (library.examples && library.examples.length) ? (
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
      {skipMeta ? null : (
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
    fontWeight: '600',
    fontSize: 20,
    textDecorationLine: 'none',
  },
  nameHovered: {
    color: colors.gray4,
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
    marginTop: 12,
  },
  secondaryStats: {
    marginVertical: 6,
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
    maxHeight: 232,
  },
  noMetaColumnContainer: {
    maxHeight: 'auto',
    width: '98.5%',
    maxWidth: '98.5%',
  },
});

export default Library;
