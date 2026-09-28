import { useState } from 'react';
import { Pressable } from 'react-native';

import { Label } from '~/common/styleguide';
import CheckBox from '~/components/CheckBox';
import tw from '~/util/tailwind';

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
      style={tw`flex-row items-center rounded px-1 py-1.5`}>
      <CheckBox value={value} style={isHovered ? tw`border-primary-dark` : undefined} />
      <Label style={[tw`select-none font-light`, isHovered && tw`text-hover`]}>{label}</Label>
    </Pressable>
  );
}
