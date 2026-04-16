import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Label } from '~/common/styleguide';
import { FileIcon, FolderIcon } from '~/components/Icons';
import tw from '~/util/tailwind';

type Props = {
  label: string;
  depth?: number;
  isActive?: boolean;
  isDirectory?: boolean;
  onPress?: () => void;
};

export default function CodeBrowserFileRow({
  label,
  depth = 0,
  isActive = false,
  isDirectory = false,
  onPress,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const rowStyle = [
    tw`flex flex-row items-center gap-1.5 px-3 py-1 last:mb-20`,
    { paddingLeft: 12 + depth * 8 },
  ];

  const content = (
    <>
      {isDirectory ? (
        <FolderIcon style={tw`size-4 shrink-0 text-icon`} />
      ) : (
        <FileIcon style={tw`size-4 shrink-0 text-icon`} />
      )}
      <Label
        style={[
          tw`font-mono`,
          isDirectory && tw`font-bold text-secondary`,
          isActive && tw`text-primary-darker dark:text-primary`,
          { wordBreak: 'break-word' },
        ]}>
        {label}
      </Label>
    </>
  );

  if (!onPress) {
    return <View style={rowStyle}>{content}</View>;
  }

  return (
    <Pressable
      style={[rowStyle, isHovered && tw`bg-palette-gray2 dark:bg-palette-gray7`]}
      onPress={onPress}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}>
      {content}
    </Pressable>
  );
}
