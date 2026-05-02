import { type PropsWithChildren } from 'react';
import { View } from 'react-native';

import { Caption } from '~/common/styleguide';
import tw from '~/util/tailwind';

export default function SelectorGroupHeader({ children }: PropsWithChildren) {
  return (
    <View style={tw`px-3 pt-2`}>
      <Caption style={tw`text-[11px] font-thin uppercase text-palette-gray4 dark:text-tertiary`}>
        {children}
      </Caption>
    </View>
  );
}
