import { type StyleProp } from 'react-native';
import { type Style } from 'twrnc';

import { Label } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = {
  count: number;
  style?: StyleProp<Style>;
};

export default function EntityCounter({ count, style }: Props) {
  return (
    <Label
      style={[
        tw`h-4.5 mt-[3px] rounded-xl bg-palette-gray2 px-1.5 py-0.5 text-[11px] text-[inherit] dark:bg-accented`,
        style,
      ]}>
      {count}
    </Label>
  );
}
