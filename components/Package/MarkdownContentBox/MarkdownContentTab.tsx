import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { P } from '~/common/styleguide';
import { type MarkdownTab, type MarkdownTabsType } from '~/types';
import { cx } from '~/util/tailwind';

type Props = {
  tab: MarkdownTab;
  activeTab: MarkdownTabsType;
  onPress?: (tab: MarkdownTabsType) => void;
};

export default function MarkdownContentTab({ tab, activeTab, onPress }: Props) {
  const [isHovered, setHovered] = useState(false);
  const Element = onPress ? Pressable : View;
  return (
    <Element
      onPress={() => onPress?.(tab.title)}
      onPointerEnter={() => onPress && setHovered(true)}
      onPointerLeave={() => onPress && setHovered(false)}
      className={cx(
        'relative my-1.5 select-none flex-row items-center gap-2 rounded px-2 py-1.5',
        cx(isHovered && 'bg-palette-gray1 dark:bg-palette-gray7')
      )}>
      <tab.Icon className="text-tertiary dark:text-pewter size-5" />
      <P className="text-[14px]">{tab.title}</P>
      {tab.title === activeTab && (
        <View className="bg-primary-dark absolute -bottom-1.5 left-0 h-0.5 w-full rounded" />
      )}
    </Element>
  );
}
