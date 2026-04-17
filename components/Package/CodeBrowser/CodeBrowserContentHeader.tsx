import { type PropsWithChildren } from 'react';
import { View } from 'react-native';

import { P } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = PropsWithChildren<{
  filePath: string;
}>;

export default function CodeBrowserContentHeader({ filePath, children }: Props) {
  return (
    <View
      style={[
        tw`flex min-h-[45px] flex-row justify-between gap-3 border-b border-palette-gray2 bg-default px-4 py-3 dark:border-default`,
        !children && tw`pr-20`,
      ]}>
      <P style={[tw`font-mono mt-px font-bold`, { wordBreak: 'break-all' }]}>{filePath}</P>
      {children}
    </View>
  );
}
