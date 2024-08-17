import { useRef } from 'react';
import { Pressable } from 'react-native';
import { useHover } from 'react-native-web-hooks';

import { colors } from '../../common/styleguide';
import { XIcon } from '../Icons';
import Tooltip from '../Tooltip';

type ClearButtonProps = {
  onPress: () => void;
};

export const ClearButton = ({ onPress }: ClearButtonProps) => {
  const xIconRef = useRef();
  const isXIconHovered = useHover(xIconRef);
  return (
    <Tooltip
      sideOffset={8}
      trigger={
        <Pressable ref={xIconRef} onPress={onPress} aria-label="Clear all">
          <XIcon fill={isXIconHovered ? colors.primary : colors.white} width={12} height={12} />
        </Pressable>
      }>
      Clear all
    </Tooltip>
  );
};
