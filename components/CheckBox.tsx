import { type ComponentType } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import tw from '~/util/tailwind';

import { Check, type IconProps } from './Icons';

type Props = {
  style?: StyleProp<ViewStyle>;
  value?: boolean;
  Icon?: ComponentType<IconProps>;
};

export default function CheckBox({ style, value, Icon = Check }: Props) {
  return (
    <View
      style={[
        tw`mr-2 size-[18px] items-center justify-center rounded-sm border-2`,
        value
          ? tw`border-primary-dark bg-primary-dark`
          : tw`border-palette-gray4 bg-white dark:border-default dark:bg-dark`,
        { transition: 'border-color .33s, background-color .33s' },
        style,
      ]}>
      {value ? <Icon width={14} height={10} style={tw`text-white dark:text-black`} /> : null}
    </View>
  );
}
