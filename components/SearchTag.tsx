import { startCase } from 'es-toolkit';
import { View } from 'react-native';

import { A, HoverEffect } from '~/common/styleguide';
import { XIcon } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import tw from '~/util/tailwind';

type Props = {
  title: string;
  value: string;
};

export default function SearchTag({ title, value }: Props) {
  return (
    <View
      style={tw`flex-row text-[12px] items-center no-underline rounded pr-1.5 border border-default bg-palette-gray1 dark:bg-dark`}>
      <View
        style={tw`pl-2.5 pr-2 h-full justify-center text-secondary select-none border-r border-default bg-palette-gray2 dark:bg-powder`}>
        <span>{title}</span>
      </View>
      <Tooltip
        trigger={
          <HoverEffect>
            <A href="/" style={tw`flex flex-row gap-1.5 pl-2 items-center no-underline`}>
              {startCase(value)}
              <XIcon style={tw`w-2.5 text-error`} />
            </A>
          </HoverEffect>
        }>
        Clear search tag
      </Tooltip>
    </View>
  );
}
