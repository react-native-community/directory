import { type PropsWithChildren } from 'react';
import { View } from 'react-native';

import { Caption } from '~/common/styleguide';

export default function SelectorGroupHeader({ children }: PropsWithChildren) {
  return (
    <View className="px-2.5 pt-1.5">
      <Caption className="text-palette-gray4 dark:text-tertiary text-[11px] font-thin uppercase">
        {children}
      </Caption>
    </View>
  );
}
