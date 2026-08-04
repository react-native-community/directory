import { type PressableProps } from 'react-native';
import { type Style } from 'twrnc';

import { HoverEffect } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = PressableProps & {
  hoveredStyle?: Style;
};

export default function SelectorItemHoverEffect({ children, hoveredStyle, ...rest }: Props) {
  return (
    <HoverEffect
      style={[
        tw`mx-0.5 cursor-pointer rounded text-black dark:text-white`,
        { transition: 'background-color 0.2s' },
      ]}
      hoveredStyle={hoveredStyle ?? tw`bg-palette-gray2 dark:bg-palette-gray7`}
      focusable
      {...rest}>
      {children}
    </HoverEffect>
  );
}
