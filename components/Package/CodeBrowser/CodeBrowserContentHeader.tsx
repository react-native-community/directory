import { type PropsWithChildren } from 'react';
import { View } from 'react-native';

import { P } from '~/common/styleguide';
import { WarningBlockquoteIcon } from '~/components/Icons';
import { Tooltip } from '~/components/Tooltip';
import { getFileWarning } from '~/util/codeBrowser';
import { cx } from '~/util/tailwind';

type Props = PropsWithChildren<{
  filePath: string;
}>;

export default function CodeBrowserContentHeader({ filePath, children }: Props) {
  const warning = getFileWarning(filePath.split('/').at(-1));
  return (
    <View
      className={cx(
        'flex min-h-[45px] flex-row items-center justify-between gap-3 border-b border-palette-gray2 bg-default px-4 py-3 dark:border-border',
        cx(!children && 'pr-20')
      )}>
      <P className={cx('font-mono flex items-center gap-1.5 break-all text-[13px]')}>
        {filePath}
        {warning && (
          <Tooltip
            trigger={
              <View className="ml-auto">
                <WarningBlockquoteIcon className="text-warning-dark dark:text-warning size-3.5" />
              </View>
            }>
            <P className="text-[12px] leading-0.5 font-light">{warning.message}</P>
          </Tooltip>
        )}
      </P>
      {children}
    </View>
  );
}
