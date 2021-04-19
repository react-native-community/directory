import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, darkColors, P } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Library as LibraryType } from '../../types';

type Props = {
  library: LibraryType;
};

const getPopularityStyles = popularity => {
  if (popularity > 0.5) {
    return {
      width: 32,
      backgroundColor: '#fb0d9e',
    };
  } else if (popularity > 0.25) {
    return {
      width: 24,
      backgroundColor: '#e20026',
    };
  } else if (popularity > 0.1) {
    return {
      width: 18,
      backgroundColor: '#ff5900',
    };
  } else if (popularity > 0) {
    return {
      width: 12,
      backgroundColor: '#dc9a00',
    };
  } else {
    return {
      width: 6,
      backgroundColor: colors.gray4,
    };
  }
};

const getPopularityGrade = popularity => {
  if (popularity > 0.5) {
    return 'HOT!';
  } else if (popularity > 0.25) {
    return 'Popular';
  } else if (popularity > 0.1) {
    return 'Quite popular';
  } else if (popularity > 0) {
    return 'Trending';
  } else {
    return 'In shadow';
  }
};

const PopularityMark = ({ library }: Props) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const { popularity = -1 } = library;
  const popularityStyles = getPopularityStyles(popularity);
  const markBackgroundColor = isDark ? darkColors.border : colors.gray2;

  return (
    <View>
      <View
        style={[
          styles.popularityMark,
          styles.popularityMarkBackground,
          { backgroundColor: markBackgroundColor },
        ]}
      />
      <View style={[styles.popularityMark, popularityStyles]} />
      <P style={[styles.popularityScore, { color: popularityStyles.backgroundColor }]}>
        {getPopularityGrade(popularity)} ({(popularity * 100).toFixed(1)})
      </P>
    </View>
  );
};

const styles = StyleSheet.create({
  popularityMark: {
    height: 8,
    position: 'absolute',
    top: 5,
    borderRadius: 4,
  },
  popularityMarkBackground: {
    width: 32,
  },
  popularityScore: {
    paddingLeft: 40,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default PopularityMark;
