import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { P } from '~/common/styleguide';
import { FileIcon, FolderIcon, WarningBlockquote } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import { getFileWarning } from '~/util/codeBrowser';
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
  const warning = isDirectory ? undefined : getFileWarning(label);

  const Icon = useMemo(() => (isDirectory ? FolderIcon : FileIcon), [isDirectory]);

  const rowStyle = [
    tw`flex flex-row items-center gap-1.5 px-3 py-[3px] last:mb-20`,
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
      <P
        style={[
          tw`font-mono select-none text-[12px] font-light tracking-normal`,
          isDirectory && tw`font-extralight text-palette-gray5 dark:text-palette-gray4`,
          isActive && tw`text-primary-darker dark:text-primary`,
          { wordBreak: 'break-word' },
        ]}>
        {label}
      </P>
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
