import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { P } from '~/common/styleguide';
import {
  ArrowIcon,
  FileIcon,
  FileMetadataIcon,
  FolderIcon,
  FolderOpenIcon,
  ImageFileIcon,
  WarningBlockquoteIcon,
} from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import { getFileWarning, IMAGE_FILES } from '~/util/codeBrowser';
import tw from '~/util/tailwind';

type Props = {
  label: string;
  depth?: number;
  isActive?: boolean;
  isDirectory?: boolean;
  isCollapsed?: boolean;
  isNested?: boolean;
  onPress?: () => void;
};

export default function CodeBrowserFileRow({
  label,
  depth = 0,
  isActive = false,
  isDirectory = false,
  isCollapsed = false,
  isNested = false,
  onPress,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const warning = isDirectory ? undefined : getFileWarning(label);
  const fileExtension = label.split('.').at(-1) ?? 'text';
  const isImageFile = IMAGE_FILES.includes(fileExtension);

  const Icon = useMemo(() => {
    if (isDirectory) {
      if (isCollapsed) {
        return FolderIcon;
      }
      return FolderOpenIcon;
    } else if (isNested) {
      return FileMetadataIcon;
    } else if (isImageFile) {
      return ImageFileIcon;
    }
    return FileIcon;
  }, [isDirectory, isNested, isImageFile, isCollapsed]);

  const rowStyle = [
    tw`flex flex-row items-center gap-1.5 px-3 py-[3px] last:mb-20`,
    isDirectory && tw`pl-1.5`,
    { paddingLeft: (isNested ? 6 : 10) + depth * 8 },
  ];
  const hasTrailingContent = warning != null || isDirectory;

  const content = (
    <>
      {isDirectory ? (
        <ArrowIcon
          style={[
            tw`size-2.5 shrink-0 text-palette-gray4 dark:text-palette-gray5`,
            isCollapsed ? tw`rotate-90` : tw`rotate-270`,
          ]}
        />
      ) : (
        <View style={tw`size-2.5`} />
      )}
      <Icon
        style={[
          tw`size-4 shrink-0 text-icon`,
          isNested && tw`size-3 text-palette-gray5`,
          isActive && tw`text-primary-darker dark:text-primary-dark`,
          isDirectory && tw`text-tertiary dark:text-accented`,
        ]}
      />
      <P
        style={[
          tw`font-mono select-none text-[12px] font-light tracking-normal`,
          isNested &&
            tw`text-[11px] font-extralight text-palette-gray6 dark:font-thin dark:text-palette-gray3`,
          isDirectory && tw`font-extralight text-palette-gray5 dark:text-palette-gray4`,
          isActive && tw`text-primary-darker dark:text-primary`,
          { wordBreak: 'break-word' },
        ]}>
        {label}
      </P>
      {hasTrailingContent && (
        <View style={tw`ml-auto flex-row items-center gap-1.5`}>
          {warning && (
            <Tooltip
              trigger={
                <View>
                  <WarningBlockquoteIcon style={tw`size-3.5 text-warning-dark dark:text-warning`} />
                </View>
              }>
              <P style={tw`text-[12px] font-light`}>{warning.message}</P>
            </Tooltip>
          )}
        </View>
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
