import { type StyleProp, type TextStyle } from 'react-native';

import { Label } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = {
  count: number;
  style?: StyleProp<TextStyle>;
};

export default function EntityCounter({ count, style }: Props) {
  return (
    <Label
      style={[
        tw`mt-[3px] text-[11px] rounded-xl py-0.5 px-1.5 text-[inherit] bg-palette-gray2 dark:bg-accented`,
        style,
      ]}>
      {count}
    </Label>
  );
}
