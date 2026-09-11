import * as Popover from '@radix-ui/react-popover';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { View } from 'react-native';

import { A, HoverEffect, P } from '~/common/styleguide';
import { ArrowIcon } from '~/components/Icons';
import NavigationTab from '~/components/NavigationTab';
import EntityCounter from '~/components/Package/EntityCounter';
import { useNavigationTabs } from '~/components/Package/Navigation/useNavigationTabs';
import SelectorItemHoverEffect from '~/components/Selector/SelectorItemHoverEffect';
import tw from '~/util/tailwind';

type Tab = {
  title: string;
  path: string;
  counter?: number | string;
};

type Props = {
  tabs: Tab[];
};

const TABS_GAP = 8;

export default function NavigationTabs({ tabs }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const currentPath = decodeURIComponent(router.asPath.split('?')[0]);
  const activeIndex = tabs.findIndex(tab => decodeURIComponent(tab.path) === currentPath);

  const {
    visible,
    measuring,
    navigationRef,
    tabRef,
    triggerRef,
    onNavigationLayout,
    onTabLayout,
    onTriggerLayout,
  } = useNavigationTabs(tabs.length, TABS_GAP);

  const hiddenTabs = tabs.slice(visible);
  const isTriggerActive = activeIndex >= visible;

  return (
    <View
      ref={navigationRef}
      style={tw`relative flex-1 overflow-hidden`}
      onLayout={onNavigationLayout}>
      <View
        style={[
          tw`pointer-events-none absolute left-0 top-0 flex-row items-center opacity-0`,
          { rowGap: TABS_GAP },
        ]}
        aria-hidden>
        {tabs.map((tab, index) => (
          <View key={tab.title} ref={tabRef(index)} onLayout={onTabLayout(index)}>
            <NavigationTab {...tab} />
          </View>
        ))}
        <View ref={triggerRef} onLayout={onTriggerLayout}>
          <MoreTrigger active={false} open={false} />
        </View>
      </View>
      <View
        style={[
          tw`flex-1 flex-row items-center`,
          measuring && tw`opacity-0`,
          measuring ? tw`pointer-events-none` : tw`pointer-events-auto`,
          { rowGap: TABS_GAP },
        ]}>
        {tabs.slice(0, visible).map(tab => (
          <NavigationTab key={tab.title} {...tab} />
        ))}
        {hiddenTabs.length > 0 && (
          <Popover.Root open={open} onOpenChange={setOpen}>
            <HoverEffect
              hoveredStyle={tw`bg-palette-gray6 dark:bg-default`}
              pressedStyle={tw`bg-palette-gray6 dark:bg-default`}
              style={[tw`rounded`, isTriggerActive && tw`bg-primary-hover`]}>
              <Popover.Trigger asChild>
                <View role="button">
                  <MoreTrigger active={isTriggerActive} open={open} />
                </View>
              </Popover.Trigger>
            </HoverEffect>
            <Popover.Portal>
              <Popover.Content align="end" sideOffset={6}>
                <View
                  style={tw`min-w-40 overflow-hidden rounded-lg border-2 border-palette-gray2 bg-default py-0.5 shadow-lg dark:border-default dark:bg-default`}>
                  {hiddenTabs.map((tab, index) => (
                    <SelectorItemHoverEffect key={tab.title} onPress={() => setOpen(false)}>
                      <A
                        href={tab.path}
                        style={tw`flex-row items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 no-underline`}
                        target="_self">
                        <P
                          style={[
                            tw`text-[inherit]`,
                            visible + index === activeIndex &&
                              tw`text-primary-darker dark:text-primary`,
                          ]}>
                          {tab.title}
                        </P>
                        {!!tab.counter && (
                          <EntityCounter count={tab.counter} style={tw`text-[inherit]`} />
                        )}
                      </A>
                    </SelectorItemHoverEffect>
                  ))}
                </View>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )}
      </View>
    </View>
  );
}

function MoreTrigger({ active, open }: { active: boolean; open: boolean }) {
  return (
    <View style={tw`cursor-pointer flex-row items-center gap-1 px-4 pb-2 pt-1.5`}>
      <P style={[tw`text-white`, active && tw`text-primary`]}>More</P>
      <ArrowIcon
        style={[
          tw`h-3 w-4 shrink-0`,
          active ? tw`text-primary` : tw`text-icon`,
          open ? tw`rotate-270` : tw`rotate-90`,
          { transition: 'all 0.2s' },
        ]}
      />
    </View>
  );
}
