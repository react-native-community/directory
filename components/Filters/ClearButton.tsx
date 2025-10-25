import { useState } from 'react';
import { Pressable, type PressableProps, StyleSheet } from 'react-native';

import { colors } from '~/common/styleguide';

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
          style={styles.container}
          aria-label="Clear all">
          <XIcon fill={isXIconHovered ? colors.error : colors.white} width={12} height={12} />
        </Pressable>
      }>
      Clear all
    </Tooltip>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
