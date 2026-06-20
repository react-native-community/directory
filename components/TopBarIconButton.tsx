import { type PropsWithChildren } from 'react';
import { View } from 'react-native';

import { Button } from '~/components/Button';
import tw from '~/util/tailwind';

import Tooltip from './Tooltip';

type Props = PropsWithChildren<{
  label: string;
  tooltip: string;
  href?: string;
  openInNewTab?: boolean;
  onPress?: () => void;
  style?: object;
}>;

export default function TopBarIconButton({
  label,
  tooltip,
  href,
  openInNewTab,
  onPress,
  children,
}: Props) {
  return (
    <Tooltip
      trigger={
        <View>
          <Button
            aria-label={label}
            href={href}
            openInNewTab={openInNewTab}
            onPress={onPress}
            style={tw`size-8.5 bg-transparent px-1`}
            containerStyle={tw`rounded-full`}>
            {children}
          </Button>
        </View>
      }>
      {tooltip}
    </Tooltip>
  );
}
