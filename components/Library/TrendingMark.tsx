import { useContext } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors, darkColors, P, A } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { Library as LibraryType } from '~/types';

type Props = {
  library: LibraryType | { popularity: number };
  markOnly?: boolean;
  style?: ViewStyle;
};

const TrendingMark = ({ library, style, markOnly = false }: Props) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const { popularity = -100 } = library;
  const popularityStyles = getPopularityStyles(popularity, markOnly);
  const markBackgroundColor = isDark ? darkColors.border : colors.gray2;

  const content = (
    <>
      <View
        style={[
          styles.popularityMark,
          styles.popularityMarkBackground,
          { backgroundColor: markBackgroundColor, top: markOnly ? 11 : 7 },
        ]}
      />
      <View style={[styles.popularityMark, popularityStyles]} />
      <P
        style={[
          styles.popularityScore,
          {
            color: popularityStyles.backgroundColor,
            marginBottom: markOnly ? 0 : 6,
            fontSize: markOnly ? 15 : 12,
          },
        ]}>
        {getPopularityGrade(popularity)}
        {!markOnly && ` (${(popularity * 100).toFixed(1)})`}
      </P>
    </>
  );

  return markOnly ? (
    <View style={[styles.container, style]}>{content}</View>
  ) : (
    <A href="/scoring" style={[styles.scoringLink, style]}>
      {content}
    </A>
  );
};

const getPopularityStyles = (popularity, markOnly) => {
  const top = markOnly ? 11 : 7;
  if (popularity > 0.5) {
    return {
      width: 32,
      backgroundColor: '#fb0d9e',
      top,
    };
  } else if (popularity > 0.25) {
    return {
      width: 24,
      backgroundColor: '#e70a2f',
      top,
    };
  } else if (popularity > 0.1) {
    return {
      width: 18,
      backgroundColor: '#ff5900',
      top,
    };
  } else if (popularity > 0) {
    return {
      width: 12,
      backgroundColor: '#dc9a00',
      top,
    };
  } else {
    return {
      width: 6,
      backgroundColor: colors.gray4,
      top,
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
    return 'Declining';
  }
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  popularityMark: {
    height: 6,
    position: 'absolute',
    borderRadius: 4,
  },
  popularityMarkBackground: {
    width: 32,
  },
  popularityScore: {
    paddingLeft: 40,
    fontWeight: 700,
  },
  scoringLink: {
    textDecorationLine: 'none',
    position: 'relative',
    lineHeight: 18,
    backgroundColor: 'none',
  },
});

export default TrendingMark;
