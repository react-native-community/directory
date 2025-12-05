import { type PropsWithChildren, useContext } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, darkColors, Headline, P } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

type Props = PropsWithChildren<{
  headline: string;
  score?: number;
  style?: ViewStyle;
}>;

export function ScoringCriterion({ children, headline, style, score = undefined }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);

  const textStyle = {
    color: isDark ? colors.gray2 : colors.black,
  };
  const borderStyle = {
    borderColor: isDark ? darkColors.border : colors.gray2,
  };

  const isPositiveModifier = (score ?? 0) > 0;
  return (
    <View style={[styles.criterionWrapper, borderStyle, style]}>
      <Headline style={[styles.criterion, textStyle]}>
        {score && (
          <Headline
            style={[
              styles.criterionScore,
              borderStyle,
              { color: isPositiveModifier ? colors.success : colors.error },
            ]}>
            {isPositiveModifier ? '+' : ''}
            {score}
          </Headline>
        )}
        {headline}
      </Headline>
      <P style={[styles.paragraph, { marginBottom: 0 }, textStyle]}>{children}</P>
    </View>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: 300,
  },
  criterionWrapper: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 6,
    marginBottom: 16,
  },
  criterion: {
    display: 'flex',
    gap: 12,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  criterionScore: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    fontSize: 15,
    fontWeight: '700',
    padding: 1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
    textAlign: 'center',
  },
});
