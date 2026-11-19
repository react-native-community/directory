import * as Popover from '@radix-ui/react-popover';
import { useRef, useState } from 'react';
import { View } from 'react-native';

import { A, HoverEffect, P, useLayout } from '~/common/styleguide';
import { ArrowUpRightIcon, PlusIcon } from '~/components/Icons';
import SelectorItemHoverEffect from '~/components/Selector/SelectorItemHoverEffect';
import { cx } from '~/util/tailwind';

export default function AddLibrarySelector() {
  const { isSmallScreen } = useLayout();

  const [open, setOpen] = useState(false);
  const firstOptionRef = useRef<HTMLAnchorElement>(null);

  return (
    <Popover.Root open={open} onOpenChange={state => setOpen(state)}>
      <HoverEffect>
        <Popover.Trigger asChild>
          <View role="dialog">
            <View
              role="button"
              className={cx(
                'cursor-pointer select-none items-center justify-center rounded bg-primary-darker outline-offset-1 dark:bg-primary-dark',
                'max-h-8.5 flex-row items-center gap-1 px-4 py-2',
                cx(isSmallScreen && 'w-8.5 px-0')
              )}>
              <PlusIcon className={cx('size-3.5 text-white', cx(!isSmallScreen && '-ml-0.5'))} />
              {!isSmallScreen && <P className="ml-1 text-white">Add a library</P>}
            </View>
          </View>
        </Popover.Trigger>
      </HoverEffect>
      <Popover.Portal>
        <Popover.Content
          align="center"
          sideOffset={6}
          alignOffset={4}
          onOpenAutoFocus={event => {
            event.preventDefault();
            firstOptionRef.current?.focus();
          }}>
          <View className="border-secondary-border bg-palette-gray7 dark:border-border dark:bg-default w-40 overflow-hidden rounded-lg border-2 py-0.5">
            <SelectorItemHoverEffect
              focusable={false}
              hoveredStyle="bg-[#2a2e36] dark:bg-palette-gray7">
              <A
                ref={firstOptionRef}
                className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-white no-underline -outline-offset-2"
                href="https://github.com/react-native-community/directory/?tab=readme-ov-file#how-do-i-add-a-library">
                Add manually
                <ArrowUpRightIcon className="text-icon size-3.5" />
              </A>
            </SelectorItemHoverEffect>
            <SelectorItemHoverEffect
              focusable={false}
              hoveredStyle="bg-[#2a2e36] dark:bg-palette-gray7">
              <A
                className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-white no-underline -outline-offset-2"
                href="https://github.com/simek/rn-directory?tab=readme-ov-file#rn-directory">
                Add via CLI
                <ArrowUpRightIcon className="text-icon size-3.5" />
              </A>
            </SelectorItemHoverEffect>
          </View>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
