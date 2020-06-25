import emoji from 'node-emoji';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Linkify from 'react-simple-linkify';

import { colors, layout, A, Label, Caption } from '../../common/styleguide';
import { Library as LibraryType } from '../../types';
import { isEmptyOrNull } from '../../util/strings';
import { CompatibilityTags } from '../CompatibilityTags';
import { Badge, Warning } from '../Icons';
import { MetaData } from './MetaData';
import Thumbnail from './Thumbnail';

type Props = {
  library: LibraryType;
};

export default function Library(props: Props) {
  const { library } = props;

  return (
    <View style={[styles.container, layout.isSmallScreen() && styles.containerColumn]}>
      <View style={styles.columnOne}>
        <View style={styles.displayHorizontal}>
          <A
            href={library.githubUrl || library.github.urls.repo}
            style={styles.name}
            hoverStyle={styles.nameHovered}>
            {library.npmPkg || library.github.name}
          </A>
          {library.goldstar && (
            <View style={[styles.displayHorizontal, styles.recommendedContainer]}>
              <View style={styles.recommendedTextContainer}>
                <Badge width={11} height={16} />
                <Label style={styles.recommendedText}>Recommended Library</Label>
              </View>
            </View>
          )}
        </View>
        {library.unmaintained ? (
          <View style={styles.unmaintainedTextWrapper}>
            <View style={styles.unmaintainedTextContainer}>
              <Warning width={15} height={15} />
              <Label style={styles.unmaintainedText}>This library is not actively maintained</Label>
            </View>
          </View>
        ) : null}
        <View style={styles.verticalMargin}>
          <CompatibilityTags library={library} />
        </View>
        {!isEmptyOrNull(library.github.description) && (
          <View style={styles.verticalMargin}>
            <Caption>
              <Linkify component={({ url }) => <A href={url}>{url}</A>}>
                {emoji.emojify(library.github.description)}
              </Linkify>
            </Caption>
          </View>
        )}
        {library.examples && library.examples.length ? (
          <View style={[styles.displayHorizontal, styles.verticalMargin]}>
            <Caption>Code Examples: </Caption>
            {library.examples.map((example, index) => (
              <A target="blank" key={example} style={{ marginRight: 6 }} href={example}>
                <Caption>#{index + 1}</Caption>
              </A>
            ))}
          </View>
        ) : null}
        {Platform.OS === 'web' && library.images && library.images.length ? (
          <View style={[styles.displayHorizontal, styles.imagesContainer]}>
            {library.images.map((image, index) => (
              <Thumbnail key={`${image}-${index}`} url={image} />
            ))}
          </View>
        ) : null}
      </View>
      <View style={[styles.columnTwo, layout.isSmallScreen() && styles.columnTwoSmall]}>
        <MetaData library={library} />
      </View>
    </View>
  );
}

let styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.gray2,
    marginBottom: 16,
    borderRadius: 4,
    flexDirection: 'row',
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
  },
  columnTwo: {
    ...Platform.select({
      web: {
        flex: 0.35,
      },
    }),
    padding: 16,
    borderLeftWidth: 1,
    borderLeftColor: colors.gray2,
  },
  columnTwoSmall: {
    borderLeftWidth: 0,
    borderTopWidth: 1,
    borderTopColor: colors.gray2,
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
  recommendedContainer: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: colors.powder,
    borderRadius: 2,
    marginLeft: 8,
    top: 1,
  },
  recommendedTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedText: {
    marginLeft: 4,
  },
  unmaintainedTextWrapper: {
    flexDirection: 'row',
  },
  unmaintainedTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: colors.warningLight,
    borderColor: colors.warning,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 2,
  },
  unmaintainedText: {
    marginLeft: 4,
    color: colors.warningDark,
  },
  verticalMargin: {
    marginTop: 12,
  },
  imagesContainer: {
    flexWrap: 'wrap',
    marginTop: 20,
    marginBottom: 12,
    marginLeft: 2,
  },
});
