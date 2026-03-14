import { useState } from 'react';
import { type StyleProp } from 'react-native';
import { type Style } from 'twrnc';

import { Button } from '~/components/Button';
import { CheckSquare, Copy } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import tw from '~/util/tailwind';

type Props = {
  data: string;
  tooltip: string;
  label: string;
  style?: StyleProp<Style>;
};

export default function CopyButton({ data, tooltip, label, style }: Props) {
  const [copied, setCopied] = useState(false);
  const Icon = copied ? CheckSquare : Copy;

  return (
    <Tooltip
      sideOffset={2}
      trigger={
        <Button
          containerStyle={[tw`absolute right-3 top-3`, style]}
          style={tw`bg-transparent`}
          onPress={async () => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(data);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 1000);
            }
          }}
          aria-label={label}>
          <Icon
            style={[tw`size-5 text-palette-gray4 dark:text-pewter`, copied && tw`text-success`]}
          />
        </Button>
      }>
      {copied ? 'Copied' : tooltip}
    </Tooltip>
  );
}
