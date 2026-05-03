import { type PressableProps } from 'react-native';

import { HoverEffect } from '~/common/styleguide';
import tw from '~/util/tailwind';

export default function SelectorItemHoverEffect({ children, ...rest }: PressableProps) {
  return (
    <HoverEffect
      style={tw`cursor-pointer px-3 py-1.5 text-black dark:text-white`}
      hoveredStyle={tw`bg-palette-gray2 dark:bg-palette-gray7`}
      focusable
      {...rest}>
      {children}
    </HoverEffect>
  );
}
