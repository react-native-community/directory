import { type PropsWithChildren } from 'react';
import { View } from 'react-native';

import tw from '~/util/tailwind';

export default function ChartTooltip({ children }: PropsWithChildren) {
  const isDark = tw.prefixMatch('dark');
  return (
    <View
      style={[
        tw`font-sans flex flex-col gap-px rounded px-2.5 py-1.5 text-xs font-light text-white dark:border dark:border-default`,
        {
          boxShadow: '0 8px 24px #00000088',
          backgroundColor: isDark ? '#000b' : '#000d',
          backdropFilter: 'blur(10px)',
        },
      ]}>
      {children}
    </View>
  );
}
