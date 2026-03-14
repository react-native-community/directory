import { type Dispatch, type SetStateAction, useState } from 'react';
import { Pressable, View } from 'react-native';

import { P } from '~/common/styleguide';
import { type MarkdownTab, type MarkdownTabsType } from '~/types';
import tw from '~/util/tailwind';

type Props = {
  tab: MarkdownTab;
  activeTab: MarkdownTabsType;
  setActiveTab: Dispatch<SetStateAction<MarkdownTabsType>>;
};

export default function MarkdownContentTab({ tab, activeTab, setActiveTab }: Props) {
  const [isHovered, setHovered] = useState<boolean>(false);
  return (
    <Pressable
      onPress={() => setActiveTab(tab.title)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={[
        tw`relative my-1.5 flex-row items-center gap-2 rounded px-2 py-1.5`,
        isHovered && tw`bg-palette-gray1 dark:bg-palette-gray7`,
      ]}>
      <tab.Icon style={tw`size-5 text-tertiary dark:text-pewter`} />
      <P style={tw`text-[14px]`}>{tab.title}</P>
      {tab.title === activeTab && (
        <View style={tw`absolute -bottom-1.5 left-0 h-0.5 w-full rounded bg-primary-dark`} />
      )}
    </Pressable>
  );
}
