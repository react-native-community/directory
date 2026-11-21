import { type PressableProps } from 'react-native';

import { HoverEffect } from '~/common/styleguide';
import { cx } from '~/util/tailwind';

type Props = PressableProps & {
  hoveredStyle?: string;
};

export default function SelectorItemHoverEffect({
  children,
  hoveredStyle,
  focusable,
  ...rest
}: Props) {
  return (
    <HoverEffect
      className={cx(
        'mx-0.5 cursor-pointer rounded text-black transition-colors duration-200 dark:text-white'
      )}
      hoveredStyle={hoveredStyle ?? 'bg-palette-gray2 dark:bg-palette-gray7'}
      focusable={focusable}
      {...rest}>
      {children}
    </HoverEffect>
  );
}
