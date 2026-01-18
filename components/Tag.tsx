import { type ReactElement } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { Label } from '~/common/styleguide';
import tw from '~/util/tailwind';

import { Check } from './Icons';

type Props = {
  label: string;
  tagStyle: StyleProp<ViewStyle>;
  icon?: ReactElement | null;
};

export function Tag({
  label,
  tagStyle,
  icon = <Check width={12} height={8} style={tw`text-palette-gray5`} />,
}: Props) {
  return (
    <View
      key={label}
      style={[
        tw`flex-row items-center border rounded px-2 py-1 select-none gap-[5px] min-h-6`,
        tagStyle,
      ]}>
      {icon}
      <Label style={tw`text-black dark:text-secondary`}>{label}</Label>
    </View>
  );
}
