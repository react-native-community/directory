import { useState } from 'react';
import { Pressable } from 'react-native';

import { Label } from '~/common/styleguide';
import CheckBox from '~/components/CheckBox';
import { cx } from '~/util/tailwind';

type Props = {
  value: boolean;
  label: string;
  onChange: (value: boolean) => void;
};

export default function CodeBrowserSettingsCheckbox({ value, label, onChange }: Props) {
  const [isHovered, setHovered] = useState(false);

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPress={() => onChange(!value)}
      className="flex-row items-center rounded px-1 py-1.5">
      <CheckBox value={value} className={cx(isHovered && 'border-primary-dark')} />
      <Label className={cx('select-none font-light', cx(isHovered && 'text-hover'))}>{label}</Label>
    </Pressable>
  );
}
