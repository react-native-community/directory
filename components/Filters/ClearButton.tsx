import { useState } from 'react';
import { Pressable, type PressableProps } from 'react-native';

import { XIcon } from '~/components/Icons';
import { Tooltip } from '~/components/Tooltip';
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
          className="size-6 items-center justify-center"
          aria-label="Clear all">
          <XIcon className={isXIconHovered ? 'text-error size-3' : 'size-3 text-white'} />
        </Pressable>
      }>
      Clear all
    </Tooltip>
  );
}
