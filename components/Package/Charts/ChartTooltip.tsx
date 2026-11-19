import { type PropsWithChildren } from 'react';
import { View } from 'react-native';

import { cx, useIsDark } from '~/util/tailwind';

export default function ChartTooltip({ children }: PropsWithChildren) {
  const isDark = useIsDark();

  return (
    <View
      className={cx(
        'font-sans flex flex-col gap-px rounded px-2.5 py-1.5 text-xs font-light text-white shadow-[0_8px_24px_#00000088] backdrop-blur-[10px] dark:border dark:border-border',
        isDark ? 'bg-[#000b]' : 'bg-[#000d]'
      )}>
      {children}
    </View>
  );
}
