import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Label } from '~/common/styleguide';
import { FileIcon, FolderIcon, WarningBlockquote } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import { FILE_WARNINGS } from '~/util/codeBrowser';
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
  const warning = FILE_WARNINGS.find(warn => warn.fileNames.includes(label));

  const Icon = useMemo(() => (isDirectory ? FolderIcon : FileIcon), [isDirectory]);

  const rowStyle = [
    tw`flex flex-row items-center gap-1.5 px-3 py-1 last:mb-20`,
    { paddingLeft: 12 + depth * 8 },
  ];

  const content = (
    <>
      <Icon
        style={[
          tw`size-4 shrink-0 text-icon`,
          isActive && tw`text-primary-darker dark:text-primary-dark`,
          isDirectory && tw`text-tertiary dark:text-accented`,
        ]}
      />
      <Label
        style={[
          tw`font-mono select-none`,
          isDirectory && tw`text-palette-gray5 dark:text-palette-gray4`,
          isActive && tw`text-primary-darker dark:text-primary`,
          { wordBreak: 'break-word' },
        ]}>
        {label}
      </Label>
      {warning && (
        <Tooltip
          trigger={
            <View style={tw`ml-auto`}>
              <WarningBlockquote style={tw`size-3.5 text-warning-dark dark:text-warning`} />
            </View>
          }>
          <span style={tw`text-[12px]`}>{warning.message}</span>
        </Tooltip>
      )}
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
