import { useState } from 'react';
import { Pressable } from 'react-native';

import { Label } from '~/common/styleguide';
import { FileIcon } from '~/components/Icons';
import tw from '~/util/tailwind';

type Props = {
  filePath: string;
  isActive: boolean;
  onPress: () => void;
};

export default function CodeBrowserFileRow({ filePath, isActive, onPress }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Pressable
      key={filePath}
      style={[
        tw`flex flex-row items-center gap-1.5 px-3 py-1 last:mb-20`,
        isHovered && tw`bg-palette-gray2 dark:bg-palette-gray7`,
      ]}
      onPress={onPress}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}>
      <FileIcon style={tw`size-4 shrink-0 text-icon`} />
      <Label
        style={[
          tw`font-mono`,
          isActive && tw`text-primary-darker dark:text-primary`,
          { wordBreak: 'break-word' },
        ]}>
        {filePath}
      </Label>
    </Pressable>
  );
}
