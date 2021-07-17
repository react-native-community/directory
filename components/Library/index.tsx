import emoji from 'node-emoji';
import React, { useContext } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Linkify from 'react-simple-linkify';

import { colors, useLayout, A, Label, Caption, darkColors } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Library as LibraryType } from '../../types';
import { isEmptyOrNull } from '../../util/strings';
import { CompatibilityTags } from '../CompatibilityTags';
import { Badge, Warning } from '../Icons';
import { MetaData } from './MetaData';
import PopularityMark from './PopularityMark';
import Thumbnail from './Thumbnail';

type Props = {
  library: LibraryType;
  skipMeta?: boolean;
  showPopularity?: boolean;
};

export default function Library(props: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const { library, skipMeta, showPopularity } = props;
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
        {library.unmaintained ? (
          <View style={styles.unmaintainedTextWrapper}>
            <View
              style={[
                styles.unmaintainedTextContainer,
                {
                  backgroundColor: isDark ? darkColors.warning : colors.warningLight,
                },
              ]}>
              <Warning width={16} height={16} fill={isDark ? colors.gray2 : colors.warningDark} />
              <Label
                style={[
                  styles.unmaintainedText,
                  {
                    color: isDark ? colors.gray2 : colors.warningDark,
                  },
                ]}>
                This library is not actively maintained
              </Label>
            </View>
          </View>
        ) : null}
        {showPopularity && library.popularity ? <PopularityMark library={library} /> : null}
        {library.matchScore ? (
          <Label style={{ color: colors.primary }}>Debug MatchScore: {library.matchScore}</Label>
        ) : null}
        <View style={isSmallScreen ? styles.containerColumn : styles.displayHorizontal}>
          <A
            href={library.githubUrl || github.urls.repo}
            style={styles.name}
            hoverStyle={styles.nameHovered}>
            {libName}
          </A>
          {library.goldstar && (
            <View
              style={[
                styles.recommendedContainer,
                isSmallScreen ? styles.recommendedContainerSmall : null,
                {
                  backgroundColor: isDark ? colors.primaryDark : colors.primaryLight,
                },
              ]}>
              <View style={styles.recommendedTextContainer}>
                <Badge width={11} height={16} />
                <Label
                  style={[
                    styles.recommendedText,
                    {
                      color: isDark ? darkColors.dark : colors.black,
                    },
                  ]}>
                  Recommended Library
                </Label>
              </View>
            </View>
          )}
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
}

let styles = StyleSheet.create({
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
  unmaintainedTextWrapper: {
    flexDirection: 'row',
  },
  unmaintainedTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -20,
    marginBottom: 12,
    paddingLeft: 20,
    paddingRight: 12,
    paddingVertical: 6,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  unmaintainedText: {
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
