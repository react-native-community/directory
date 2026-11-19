import { type StyleProp, type TextStyle } from 'react-native';

import { Label } from '~/common/styleguide';
import { cx } from '~/util/tailwind';

type Props = {
  count: number | string;
  className?: string;
  style?: StyleProp<TextStyle>;
};

export default function EntityCounter({ count, className, style }: Props) {
  return (
    <Label
      className={cx(
        'h-4.5 mt-[3px] rounded-xl bg-palette-gray2 px-1.5 py-0.5 text-[11px] tabular-nums text-[inherit] dark:bg-accented',
        className
      )}
      style={style}>
      {count}
    </Label>
  );
}
