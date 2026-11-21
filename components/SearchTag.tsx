import { View } from 'react-native';

import { A, HoverEffect } from '~/common/styleguide';
import { XIcon } from '~/components/Icons';
import { Tooltip } from '~/components/Tooltip';

type Props = {
  title: string;
  value: string;
};

export default function SearchTag({ title, value }: Props) {
  return (
    <View className="border-border bg-palette-gray1 dark:bg-dark h-full flex-row items-center rounded border pr-1.5 text-[12px] no-underline">
      <View className="border-border bg-palette-gray2 text-secondary dark:bg-powder h-full justify-center border-r pr-2 pl-2.5 select-none">
        <span>{title}</span>
      </View>
      <Tooltip
        trigger={
          <HoverEffect>
            <A href="/packages" className="flex flex-row items-center gap-1.5 pl-2 no-underline">
              {value}
              <XIcon className="text-error w-2.5" />
            </A>
          </HoverEffect>
        }>
        Clear search tag
      </Tooltip>
    </View>
  );
}
