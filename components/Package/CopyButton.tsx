import { useState } from 'react';

import { Button } from '~/components/Button';
import { CheckSquareIcon, CopyIcon } from '~/components/Icons';
import { Tooltip } from '~/components/Tooltip';
import { cx } from '~/util/tailwind';

type Props = {
  data: string;
  tooltip: string;
  label: string;
  className?: string;
  containerClassName?: string;
};

export default function CopyButton({ data, tooltip, label, className, containerClassName }: Props) {
  const [copied, setCopied] = useState(false);
  const Icon = copied ? CheckSquareIcon : CopyIcon;

  return (
    <Tooltip
      sideOffset={2}
      trigger={
        <Button
          containerClassName={cx('absolute right-3 top-3', containerClassName)}
          className={cx('bg-transparent', className)}
          onPress={async () => {
            if (!navigator.clipboard?.writeText) {
              return;
            }
            await navigator.clipboard.writeText(data);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 1000);
          }}
          aria-label={label}>
          <Icon
            className={cx('size-5 text-palette-gray4 dark:text-pewter', copied && 'text-success')}
          />
        </Button>
      }>
      {copied ? 'Copied' : tooltip}
    </Tooltip>
  );
}
