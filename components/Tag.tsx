import { type ReactElement } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { Label } from '~/common/styleguide';
import tw from '~/util/tailwind';

import { CheckIcon } from './Icons';

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
  icon = <CheckIcon style={tw`h-2 w-3 text-palette-gray5`} />,
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
