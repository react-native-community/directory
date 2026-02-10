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
      style={tw`h-full flex-row items-center rounded border border-default bg-palette-gray1 pr-1.5 text-[12px] no-underline dark:bg-dark`}>
      <View
        style={tw`h-full select-none justify-center border-r border-default bg-palette-gray2 pl-2.5 pr-2 text-secondary dark:bg-powder`}>
        <span>{title}</span>
      </View>
      <Tooltip
        trigger={
          <HoverEffect>
            <A href="/" style={tw`flex flex-row items-center gap-1.5 pl-2 no-underline`}>
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
