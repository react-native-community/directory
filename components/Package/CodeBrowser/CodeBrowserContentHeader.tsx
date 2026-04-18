import { type PropsWithChildren } from 'react';
import { View } from 'react-native';

import { P } from '~/common/styleguide';
import { WarningBlockquote } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import { getFileWarning } from '~/util/codeBrowser';
import tw from '~/util/tailwind';

type Props = PropsWithChildren<{
  filePath: string;
}>;

export default function CodeBrowserContentHeader({ filePath, children }: Props) {
  const warning = getFileWarning(filePath.split('/').at(-1));
  return (
    <View
      style={[
        tw`flex min-h-[45px] flex-row items-center justify-between gap-3 border-b border-palette-gray2 bg-default px-4 py-3 dark:border-default`,
        !children && tw`pr-20`,
      ]}>
      <P style={[tw`font-mono flex items-center gap-1.5 text-[13px]`, { wordBreak: 'break-all' }]}>
        {filePath}
        {warning && (
          <Tooltip
            trigger={
              <View style={tw`ml-auto`}>
                <WarningBlockquote style={tw`size-3.5 text-warning-dark dark:text-warning`} />
              </View>
            }>
            <P style={tw`text-[12px] font-light`}>{warning.message}</P>
          </Tooltip>
        )}
      </P>
      {children}
    </View>
  );
}
