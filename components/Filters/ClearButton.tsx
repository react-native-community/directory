import { useState } from 'react';
import { Pressable, type PressableProps } from 'react-native';

import { XIcon } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import tw from '~/util/tailwind';

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
