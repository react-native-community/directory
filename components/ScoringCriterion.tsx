import { PropsWithChildren, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, darkColors, Headline, P } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

type Props = PropsWithChildren<{
  headline: string;
  score?: number;
}>;

export function ScoringCriterion({ children, headline, score = undefined }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const textStyle = {
    color: isDark ? colors.gray2 : colors.black,
  };
  const borderStyle = {
    borderColor: isDark ? darkColors.border : colors.gray2,
  };
  const isPositiveModifier = (score ?? 0) > 0;
  return (
    <View style={[styles.criterionWrapper, borderStyle]}>
      <Headline style={[styles.criterion, textStyle]}>
        {headline}
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
      </Headline>
      <P style={[styles.paragraph, { marginBottom: 0 }, textStyle]}>{children}</P>
    </View>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 17,
    lineHeight: 29,
    marginBottom: 17,
    fontWeight: 300,
  },
  criterionWrapper: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 6,
    marginBottom: 17,
  },
  criterion: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  criterionScore: {
    // @ts-expect-error RNW complains
    float: 'left',
    marginRight: 16,
    width: 50,
    fontSize: 15,
    fontWeight: '700',
    padding: 1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
    textAlign: 'center',
  },
});
