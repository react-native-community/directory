import { type PropsWithChildren } from 'react';
import { View } from 'react-native';

import tw from '~/util/tailwind';

export default function ChartTooltip({ children }: PropsWithChildren) {
  return (
    <View
      style={[
        tw`font-sans flex flex-col gap-px rounded bg-black px-2.5 py-1.5 text-xs font-light text-white dark:border dark:border-default`,
        { boxShadow: '0 8px 24px #00000088' },
      ]}>
      {children}
    </View>
  );
}
