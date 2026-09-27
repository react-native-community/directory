import { type ComponentType, createElement } from 'react';
import { View } from 'react-native';

import { A, Label } from '~/common/styleguide';
import { type IconProps } from '~/components/Icons';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

type Props = {
  platform: string;
  count: number;
  Icon?: ComponentType<IconProps>;
};

export default function PlatformRow({ platform, count, Icon }: Props) {
  return (
    <A
      href={urlWithQuery('/packages', { [platform.toLowerCase()]: 'true' })}
      style={tw`flex items-center justify-between`}>
      <View style={tw`flex-row items-center gap-2`}>
        {Icon && createElement(Icon, { style: tw`mt-px size-4 text-icon` })}
        <span>{platform}</span>
      </View>
      <Label style={tw`font-light text-secondary`}>{count} packages</Label>
    </A>
  );
}
