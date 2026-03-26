import { type ReactElement } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { Label } from '~/common/styleguide';
import tw from '~/util/tailwind';

import { Check } from './Icons';

type Props = {
  label: string;
  tagStyle: StyleProp<ViewStyle>;
  small?: boolean;
  icon?: ReactElement | null;
};

export function Tag({
  label,
  tagStyle,
  small,
  icon = <Check width={12} height={8} style={tw`text-palette-gray5`} />,
}: Props) {
  return (
    <View
      key={label}
      style={[
        tw`min-h-6 select-none flex-row items-center gap-[5px] rounded border px-2 py-1`,
        small && tw`min-h-5 px-1.5 py-0.5`,
        tagStyle,
      ]}>
      {!small && icon}
      <Label style={[tw`text-black dark:text-secondary`, small && tw`text-[11px]`]}>{label}</Label>
    </View>
  );
}
