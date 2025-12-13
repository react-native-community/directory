import { type PropsWithChildren } from 'react';
import { View, type ViewStyle } from 'react-native';

import { Headline, P } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = PropsWithChildren<{
  headline: string;
  score?: number;
  style?: ViewStyle;
}>;

export function ScoringCriterion({ children, headline, style, score = undefined }: Props) {
  const isPositiveModifier = (score ?? 0) > 0;

  return (
    <View style={[tw`py-3.5 px-5 border rounded-md mb-4 border-default`, style]}>
      <Headline style={tw`flex gap-3 text-lg font-semibold mb-1 leading-[24px]`}>
        {score && (
          <Headline
            style={[
              tw`flex items-center justify-center border-default min-w-[50px] leading-[21px] text-base font-bold border rounded text-center`,
              isPositiveModifier ? tw`text-success` : tw`text-error`,
            ]}>
            {isPositiveModifier ? '+' : ''}
            {score}
          </Headline>
        )}
        {headline}
      </Headline>
      <P style={tw`leading-[24px] font-light`}>{children}</P>
    </View>
  );
}
