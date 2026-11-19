import { type ReactElement } from 'react';
import { View } from 'react-native';

import { Label } from '~/common/styleguide';
import { cx } from '~/util/tailwind';

import { CheckIcon } from './Icons';

type Props = {
  label: string;
  tagClassName: string;
  small?: boolean;
  icon?: ReactElement | null;
};

export function Tag({
  label,
  tagClassName,
  small,
  icon = <CheckIcon className="text-palette-gray5 h-2 w-3" />,
}: Props) {
  return (
    <View
      key={label}
      className={cx(
        'min-h-6 select-none flex-row items-center gap-[5px] rounded border px-2 py-1',
        small && 'min-h-5 px-1.5 py-0.5',
        tagClassName
      )}>
      {!small && icon}
      <Label className={cx('text-black dark:text-secondary', cx(small && 'text-[11px]'))}>
        {label}
      </Label>
    </View>
  );
}
