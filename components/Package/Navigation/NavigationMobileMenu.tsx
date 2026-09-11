import * as Popover from '@radix-ui/react-popover';
import { View } from 'react-native';

import { A, HoverEffect, P } from '~/common/styleguide';
import { ArrowIcon } from '~/components/Icons';
import EntityCounter from '~/components/Package/EntityCounter';
import SelectorItemHoverEffect from '~/components/Selector/SelectorItemHoverEffect';
import { type PackageNavigationTab } from '~/types';
import tw from '~/util/tailwind';

type NavigationMobileMenuProps = {
  activeIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tabs: PackageNavigationTab[];
  visible: number;
  isTriggerActive: boolean;
};

export function NavigationMobileMenu({
  activeIndex,
  open,
  onOpenChange,
  tabs,
  visible,
  isTriggerActive,
}: NavigationMobileMenuProps) {
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <HoverEffect
        hoveredStyle={tw`bg-palette-gray6 dark:bg-default`}
        pressedStyle={tw`bg-palette-gray6 dark:bg-default`}
        style={[tw`rounded`, isTriggerActive && tw`bg-primary-hover`]}>
        <Popover.Trigger asChild>
          <View role="button">
            <View style={tw`cursor-pointer flex-row items-center gap-1.5 px-4 pb-2 pt-1.5`}>
              <P style={[tw`text-white`, isTriggerActive && tw`text-primary`]}>More</P>
              <ArrowIcon
                style={[
                  tw`mt-0.5 size-3 shrink-0`,
                  isTriggerActive ? tw`text-primary` : tw`text-icon`,
                  open ? tw`rotate-270` : tw`rotate-90`,
                  { transition: 'all 0.2s' },
                ]}
              />
            </View>
          </View>
        </Popover.Trigger>
      </HoverEffect>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={6}>
          <View
            style={tw`min-w-40 overflow-hidden rounded-lg border-2 border-palette-gray2 bg-default py-0.5 shadow-lg dark:border-default dark:bg-default`}>
            {tabs.map((tab, index) => (
              <SelectorItemHoverEffect key={tab.title} focusable={false}>
                <A
                  href={tab.path}
                  style={tw`flex flex-row items-center gap-2 rounded-lg px-2.5 py-1.5 no-underline`}
                  target="_self">
                  <P
                    style={[
                      tw`text-[inherit]`,
                      visible + index === activeIndex && tw`text-primary-darker dark:text-primary`,
                    ]}>
                    {tab.title}
                  </P>
                  {!!tab.counter && (
                    <EntityCounter count={tab.counter} style={tw`mt-0 text-[inherit]`} />
                  )}
                </A>
              </SelectorItemHoverEffect>
            ))}
          </View>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
