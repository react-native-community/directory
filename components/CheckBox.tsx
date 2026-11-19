import { type ComponentType } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { cx } from '~/util/tailwind';

import { CheckIcon, type IconProps } from './Icons';

type Props = {
  className?: string;
  style?: StyleProp<ViewStyle>;
  value?: boolean;
  Icon?: ComponentType<IconProps>;
};

export default function CheckBox({ className, style, value, Icon = CheckIcon }: Props) {
  return (
    <View
      className={cx(
        'mr-2 size-[18px] items-center justify-center rounded border-2 transition-colors duration-300',
        cx(
          value
            ? 'border-primary-dark bg-primary-dark'
            : 'border-palette-gray4 bg-white dark:border-border dark:bg-dark'
        ),
        className
      )}
      style={style}>
      {value ? <Icon className="h-2.5 w-3.5 text-white dark:text-black" /> : null}
    </View>
  );
}
