import { type PropsWithChildren, type ReactNode } from 'react';
import { View } from 'react-native';
import { type Style } from 'twrnc';

import { useLayout } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = PropsWithChildren<{
  style?: Style | Style[];
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  isBrowserMaximized: boolean;
}>;

export default function CodeBrowserContentFooter({
  style,
  leftSlot = <View />,
  rightSlot = <View />,
  isBrowserMaximized,
}: Props) {
  const { isSmallScreen } = useLayout();
  return (
    <View
      style={[
        tw`relative flex min-h-[26px] flex-row items-center justify-between gap-3 border-t border-palette-gray2 bg-default px-2.5 dark:border-default`,
        isBrowserMaximized ? tw`pb-px` : tw`pb-1`,
        isSmallScreen && tw`border-b border-t-0`,
        style,
      ]}>
      {leftSlot}
      {rightSlot}
    </View>
  );
}
