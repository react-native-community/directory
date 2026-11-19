import { type ComponentType, createElement } from 'react';
import { View } from 'react-native';

import { A, P } from '~/common/styleguide';
import { type IconProps } from '~/components/Icons';

type Props = {
  name: string;
  pkgName: string;
  url: string;
  Icon: ComponentType<IconProps>;
};

export default function Platform({ name, pkgName, url, Icon }: Props) {
  return (
    <A href={url} hoverStyle="rounded-lg bg-palette-gray2 dark:bg-default">
      <View className="min-w-[160px] items-center rounded-lg px-2 py-4">
        {createElement(Icon, {
          className: 'text-icon size-8',
        })}
        <P className="mt-3">{name}</P>
        <P className="text-secondary rounded-sm px-2 font-mono text-[11px] leading-6">{pkgName}</P>
      </View>
    </A>
  );
}
