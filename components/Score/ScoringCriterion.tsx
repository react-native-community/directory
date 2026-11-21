import { type PropsWithChildren } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { Headline, P } from '~/common/styleguide';
import { cx } from '~/util/tailwind';

type Props = PropsWithChildren<{
  headline: string;
  score?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}>;

export function ScoringCriterion({ children, headline, className, style, score }: Props) {
  const isPositiveModifier = (score ?? 0) > 0;

  return (
    <View
      className={cx('mb-3 rounded-lg border border-border px-5 py-3.5', className)}
      style={style}>
      <Headline className="mb-1 flex gap-3 text-[17px] leading-[22px] font-semibold">
        {score ? (
          <Headline
            className={cx(
              'flex min-w-[50px] items-center justify-center rounded border border-border text-center text-[15px] font-bold',
              cx(isPositiveModifier ? 'text-success' : 'text-error')
            )}>
            {isPositiveModifier ? '+' : ''}
            {score}
          </Headline>
        ) : null}
        {headline}
      </Headline>
      <P className="leading-[24px] font-light">{children}</P>
    </View>
  );
}
