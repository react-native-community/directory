import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDimensions } from 'react-native-web-hooks';
import { Library as LibraryType } from '../../types';
import { isEmptyOrNull } from '../../util/strings';
import { colors, A, Label, Caption } from '../../common/styleguide';
import { Badge } from '../Icons';
import { CompatibilityTags } from '../CompatibilityTags';
import { MetaData } from './MetaData';

type Props = {
  library: LibraryType;
};

export default function Library(props: Props) {
  const { library } = props;
  const {
    window: { width },
  } = useDimensions();
  const isSmallScreen = width < 800;

  return (
    <View style={[styles.container, isSmallScreen && styles.containerColumn]}>
      <View style={styles.columnOne}>
        <View style={styles.displayHorizontal}>
          <A href={library.github.urls.repo} style={styles.name} hoverStyle={styles.nameHovered}>
            {library.github.name}
          </A>
          {library.goldstar && (
            <View style={[styles.displayHorizontal, styles.recommendedContainer]}>
              <Badge width={11} height={16} />
              <Label style={styles.recommendedText}>Recommended Library</Label>
            </View>
          )}
        </View>
        <View style={styles.verticalMargin}>
          <CompatibilityTags library={library} />
        </View>
        {!isEmptyOrNull(library.github.description) && (
          <View style={styles.verticalMargin}>
            <Caption>{library.github.description}</Caption>
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
      </View>
      <View style={styles.columnTwo}>
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
    flex: 1,
    padding: 16,
  },
  columnTwo: {
    flex: 0.35,
    padding: 16,
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
  recommendedText: {
    marginLeft: 4,
  },
  verticalMargin: {
    marginTop: 12,
  },
});
