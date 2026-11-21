import { type ReactNode, useState } from 'react';
import { Pressable, View } from 'react-native';

import { P } from '~/common/styleguide';
import { ArrowIcon, WarningBlockquoteIcon } from '~/components/Icons';
import { Tooltip } from '~/components/Tooltip';
import { getDirectoryWarning, getFileWarning } from '~/util/codeBrowser';
import { cx } from '~/util/tailwind';

import { CodeBrowserFileIcon } from './CodeBrowserFileIcon';

type Props = {
  label: string;
  depth?: number;
  isActive?: boolean;
  isDirectory?: boolean;
  isCollapsed?: boolean;
  isNested?: boolean;
  rightSlot?: ReactNode;
  onPress?: () => void;
};

export default function CodeBrowserFileRow({
  label,
  depth = 0,
  isActive = false,
  isDirectory = false,
  isCollapsed = false,
  isNested = false,
  rightSlot,
  onPress,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const warning = isDirectory ? getDirectoryWarning(label) : getFileWarning(label);

  const rowClassName = cx(
    'flex flex-row items-center gap-1.5 px-3 py-[3px]',
    isDirectory && 'pl-1.5',
    !rightSlot &&
      warning &&
      'bg-[linear-gradient(45deg,_transparent_80%,_var(--warning-dark-bg)_95%)]',
    isHovered && 'bg-palette-gray2 dark:bg-palette-gray7'
  );
  const rowStyle = { paddingLeft: (isNested ? 6 : 10) + depth * 8 };

  const content = (
    <>
      {isDirectory ? (
        <ArrowIcon
          className={cx(
            'size-2.5 shrink-0 text-palette-gray4 dark:text-palette-gray5',
            cx(isHovered && 'opacity-70'),
            cx(isCollapsed ? 'rotate-90' : 'rotate-270')
          )}
        />
      ) : (
        <View className="size-2.5" />
      )}
      <CodeBrowserFileIcon
        label={label}
        isActive={isActive}
        isDirectory={isDirectory}
        isCollapsed={isCollapsed}
        isNested={isNested}
      />
      <P
        className={cx(
          'font-mono select-none text-[12px] font-light tracking-normal',
          cx(
            isNested &&
              'text-[11px] font-extralight text-palette-gray6 dark:font-thin dark:text-palette-gray3'
          ),
          cx(isDirectory && 'font-extralight text-palette-gray5 dark:text-palette-gray4'),
          cx(isActive && 'text-primary-darker dark:text-primary'),
          'break-words'
        )}>
        {label}
      </P>
      {(rightSlot || warning) && (
        <View className="ml-auto flex-row items-center gap-1.5">
          {rightSlot}
          {!rightSlot && warning && (
            <Tooltip
              trigger={
                <View>
                  <WarningBlockquoteIcon className="text-warning-dark dark:text-warning size-3.5" />
                </View>
              }>
              <span className="text-[12px] leading-0.5">{warning.message}</span>
            </Tooltip>
          )}
        </View>
      )}
    </>
  );

  if (!onPress) {
    return (
      <View className={rowClassName} style={rowStyle}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      className={rowClassName}
      style={rowStyle}
      onPress={onPress}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}>
      {content}
    </Pressable>
  );
}
