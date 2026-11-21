import { type PropsWithChildren, type ReactNode } from 'react';
import { View } from 'react-native';

import { useLayout } from '~/common/styleguide';
import { cx } from '~/util/tailwind';

type Props = PropsWithChildren<{
  className?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  isBrowserMaximized: boolean;
}>;

export default function CodeBrowserContentFooter({
  className,
  leftSlot = <View />,
  rightSlot = <View />,
  isBrowserMaximized,
}: Props) {
  const { isSmallScreen } = useLayout();
  return (
    <View
      className={cx(
        'relative flex min-h-[26px] flex-row items-center justify-between gap-3 border-t border-palette-gray2 bg-default px-2.5 dark:border-border',
        cx(isBrowserMaximized ? 'pb-px' : 'pb-1'),
        cx(isSmallScreen && 'border-b border-t-0'),
        className
      )}>
      {leftSlot}
      {rightSlot}
    </View>
  );
}
