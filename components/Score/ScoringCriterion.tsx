import { type PropsWithChildren } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { Headline, P } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = PropsWithChildren<{
  headline: string;
  score?: number;
  style?: StyleProp<ViewStyle>;
}>;

export function ScoringCriterion({ children, headline, style, score = undefined }: Props) {
  const isPositiveModifier = (score ?? 0) > 0;

  return (
    <View style={[tw`mb-4 rounded-md border border-default px-5 py-3.5`, style]}>
      <Headline style={tw`mb-1 flex gap-3 text-[17px] font-semibold leading-[22px]`}>
        {score && (
          <Headline
            style={[
              tw`flex min-w-[50px] items-center justify-center rounded border border-default text-center text-[15px] font-bold`,
              isPositiveModifier ? tw`text-success` : tw`text-error`,
            ]}>
            {isPositiveModifier ? '+' : ''}
            {score}
          </Headline>
        )}
        {headline}
      </Headline>
      <P style={tw`font-light leading-[24px]`}>{children}</P>
    </View>
  );
}
