import { type ComponentType, createElement } from 'react';
import { View } from 'react-native';

import { A, P } from '~/common/styleguide';
import { type IconProps } from '~/components/Icons';
import tw from '~/util/tailwind';

type Props = {
  name: string;
  pkgName: string;
  url: string;
  Icon: ComponentType<IconProps>;
};

export default function Platform({ name, pkgName, url, Icon }: Props) {
  return (
    <A href={url} hoverStyle={tw`rounded-lg bg-palette-gray2 dark:bg-default`}>
      <View style={tw`min-w-[160px] px-2 py-4 rounded-lg items-center`}>
        {createElement(Icon, {
          style: tw`size-8 text-icon`,
        })}
        <P style={tw`mt-3`}>{name}</P>
        <P style={tw`text-xs font-mono rounded-sm px-2 leading-loose`}>{pkgName}</P>
      </View>
    </A>
  );
}
