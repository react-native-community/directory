import { useState } from 'react';
import { Pressable, PressableProps } from 'react-native';

import { colors } from '~/common/styleguide';

import { XIcon } from '../Icons';
import Tooltip from '../Tooltip';

type ClearButtonProps = Pick<PressableProps, 'onPress'>;

export const ClearButton = ({ onPress }: ClearButtonProps) => {
  const [isXIconHovered, setIsXIconHovered] = useState(false);
  return (
    <Tooltip
      sideOffset={8}
      trigger={
        <Pressable
          onHoverIn={() => setIsXIconHovered(true)}
          onHoverOut={() => setIsXIconHovered(false)}
          onPress={onPress}
          aria-label="Clear all">
          <XIcon fill={isXIconHovered ? colors.primary : colors.white} width={12} height={12} />
        </Pressable>
      }>
      Clear all
    </Tooltip>
  );
};
