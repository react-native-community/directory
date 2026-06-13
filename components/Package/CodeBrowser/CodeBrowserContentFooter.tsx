import { type PropsWithChildren, type ReactNode } from 'react';
import { View } from 'react-native';
import { type Style } from 'twrnc';

import { useLayout } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = PropsWithChildren<{
  style?: Style | Style[];
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}>;

export default function CodeBrowserContentFooter({
  style,
  leftSlot = <View />,
  rightSlot = <View />,
}: Props) {
  const { isSmallScreen } = useLayout();
  return (
    <View
      style={[
        tw`relative flex min-h-[26px] flex-row items-center justify-between gap-3 border-t border-palette-gray2 bg-default px-3 pb-px dark:border-default`,
        isSmallScreen && tw`border-b border-t-0`,
        style,
      ]}>
      {leftSlot}
      {rightSlot}
    </View>
  );
}
