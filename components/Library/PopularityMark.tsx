import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Library as LibraryType } from '../../types';

type Props = {
  library: LibraryType;
};

const getPopularityStyles = popularity => {
  if (popularity > 0.5) {
    return {
      width: 32,
      backgroundColor: 'orangered',
    };
  } else if (popularity > 0.25) {
    return {
      width: 26,
      backgroundColor: 'coral',
    };
  } else if (popularity > 0.1) {
    return {
      width: 20,
      backgroundColor: 'orange',
    };
  } else {
    return {
      width: 14,
      backgroundColor: 'gold',
    };
  }
};

const PopularityMark = ({ library }: Props) => {
  const { popularity = -1 } = library;
  return (
    <View
      aria-label={`popularity score: ${(popularity * 100).toFixed(3)}`}
      style={[styles.popularityMark, getPopularityStyles(popularity)]}
    />
  );
};

const styles = StyleSheet.create({
  popularityMark: {
    height: 8,
    position: 'absolute',
    top: -6,
    right: -6,
    borderRadius: 4,
  },
});

export default PopularityMark;
