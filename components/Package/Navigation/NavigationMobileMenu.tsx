import * as Popover from '@radix-ui/react-popover';
import { View } from 'react-native';

import { A, HoverEffect, P } from '~/common/styleguide';
import { ArrowIcon } from '~/components/Icons';
import EntityCounter from '~/components/Package/EntityCounter';
import SelectorItemHoverEffect from '~/components/Selector/SelectorItemHoverEffect';
import { type PackageNavigationTab } from '~/types';
import { cx } from '~/util/tailwind';

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
        hoveredStyle="bg-palette-gray6 dark:bg-default"
        pressedStyle="bg-palette-gray6 dark:bg-default"
        className={cx('rounded', cx(isTriggerActive && 'bg-primary-hover'))}>
        <Popover.Trigger asChild>
          <View role="button">
            <View className="cursor-pointer flex-row items-center gap-1.5 px-4 pt-1.5 pb-2">
              <P className={cx('text-white', cx(isTriggerActive && 'text-primary'))}>More</P>
              <ArrowIcon
                className={cx(
                  'mt-0.5 size-3 shrink-0',
                  cx(isTriggerActive ? 'text-primary' : 'text-icon'),
                  cx(open ? 'rotate-270' : 'rotate-90'),
                  'transition-all duration-200'
                )}
              />
            </View>
          </View>
        </Popover.Trigger>
      </HoverEffect>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={6}>
          <View className="border-palette-gray2 bg-default dark:border-border dark:bg-default min-w-40 overflow-hidden rounded-lg border-2 py-0.5 shadow-lg">
            {tabs.map((tab, index) => (
              <SelectorItemHoverEffect key={tab.title} focusable={false}>
                <A
                  href={tab.path}
                  className="flex flex-row items-center gap-2 rounded-lg px-2.5 py-1.5 no-underline"
                  target="_self">
                  <P
                    className={cx(
                      'text-[inherit]',
                      cx(visible + index === activeIndex && 'text-primary-darker dark:text-primary')
                    )}>
                    {tab.title}
                  </P>
                  {!!tab.counter && (
                    <EntityCounter count={tab.counter} className="mt-0 text-[inherit]" />
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
