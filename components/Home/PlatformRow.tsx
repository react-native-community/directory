import { type ComponentType, createElement } from 'react';
import { View } from 'react-native';

import { A, Label } from '~/common/styleguide';
import { type IconProps } from '~/components/Icons';
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
      className="flex items-center justify-between">
      <View className="flex-row items-center gap-2">
        {Icon && createElement(Icon, { className: 'text-icon mt-px size-4' })}
        <span>{platform}</span>
      </View>
      <Label className="text-secondary font-light">{count} packages</Label>
    </A>
  );
}
