import { useState } from 'react';
import { Pressable, type PressableProps } from 'react-native';

import tw from '~/util/tailwind';

import { XIcon } from '../Icons';
import Tooltip from '../Tooltip';

type ClearButtonProps = Pick<PressableProps, 'onPress'>;

export function ClearButton({ onPress }: ClearButtonProps) {
  const [isXIconHovered, setIsXIconHovered] = useState(false);
  return (
    <Tooltip
      sideOffset={8}
      trigger={
        <Pressable
          onHoverIn={() => setIsXIconHovered(true)}
          onHoverOut={() => setIsXIconHovered(false)}
          onPress={onPress}
          style={tw`size-6 items-center justify-center`}
          aria-label="Clear all">
          <XIcon style={isXIconHovered ? tw`text-error` : tw`text-white`} width={12} height={12} />
        </Pressable>
      }>
      Clear all
    </Tooltip>
  );
}
