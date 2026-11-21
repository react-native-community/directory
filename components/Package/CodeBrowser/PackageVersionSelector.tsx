import * as Popover from '@radix-ui/react-popover';
import { useRef, useState } from 'react';
import { type ColorValue, ScrollView, TextInput, type TextInputInstance, View } from 'react-native';
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';

import { HoverEffect, Label } from '~/common/styleguide';
import { ArrowIcon } from '~/components/Icons';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import SelectorGroupHeader from '~/components/Selector/SelectorGroupHeader';
import SelectorItemHoverEffect from '~/components/Selector/SelectorItemHoverEffect';
import { type PackageVersionsOnlyData } from '~/types';
import { TimeRange } from '~/util/datetime';
import { cx, useIsDark } from '~/util/tailwind';

type Props = {
  packageName: string;
  selectedVersion?: string;
  setVersion: (selectedVersion: string) => void;
};

export default function PackageVersionSelector({
  packageName,
  selectedVersion,
  setVersion,
}: Props) {
  const isDark = useIsDark();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 150);
  const inputRef = useRef<TextInputInstance>(null);

  const { data, isLoading } = useSWR<PackageVersionsOnlyData>(
    `/api/proxy/npm-registry-versions?name=${packageName}&versionsOnly=true`,
    (url: string) => fetch(url).then(res => res.json()),
    {
      dedupingInterval: TimeRange.HOUR * 1000,
      revalidateOnFocus: false,
    }
  );

  const query = debouncedSearch.trim();
  const filteredVersions = !query
    ? (data?.versions ?? [])
    : (data?.versions ?? []).filter(v => v.includes(query));

  const filteredDistTags = getFilteredDistTags(data, query);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setSearch('');
    } else {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function handleSelect(version: string) {
    setVersion(version);
    setOpen(false);
    setSearch('');
  }

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <HoverEffect
        hoveredStyle="border-palette-gray3 dark:border-[#333842]"
        pressedStyle="opacity-100"
        className="border-palette-gray2 dark:border-border">
        <Popover.Trigger asChild>
          <View
            role="button"
            className="bg-default dark:bg-dark min-h-8 w-[180px] cursor-pointer justify-center overflow-hidden rounded-lg border border-[inherit] px-2">
            {isLoading ? (
              <View className="scale-75 text-center">
                <ThreeDotsLoader />
              </View>
            ) : (
              <View className="flex-row items-center justify-between gap-1.5">
                <Label
                  numberOfLines={1}
                  className={cx(
                    'select-none text-[13px]',
                    cx(!selectedVersion && 'text-tertiary')
                  )}>
                  {selectedVersion ?? 'Select version'}
                </Label>
                <ArrowIcon
                  className={cx(
                    'h-3 w-4 shrink-0 text-icon transition-all duration-200',
                    cx(open ? 'rotate-270 text-primary-darker dark:text-primary-dark' : 'rotate-90')
                  )}
                />
              </View>
            )}
          </View>
        </Popover.Trigger>
      </HoverEffect>
      <Popover.Portal>
        <Popover.Content align="center" sideOffset={6}>
          <View className="border-palette-gray2 bg-default dark:border-border max-w-68 min-w-32 overflow-hidden rounded-lg border-2 shadow-lg">
            <View className="border-palette-gray2 dark:border-border border-b">
              <TextInput
                ref={inputRef}
                value={search}
                onChangeText={setSearch}
                placeholder="Filter versions…"
                className="px-2.5 py-1.5 text-sm text-black outline-0 dark:text-white"
                autoCorrect={false}
                autoCapitalize="none"
                placeholderTextColor={
                  isDark ? ('var(--gray-5)' as ColorValue) : ('var(--gray-3)' as ColorValue)
                }
              />
            </View>
            <ScrollView
              className="max-h-76 pb-0.5"
              focusable={false}
              keyboardShouldPersistTaps="handled"
              id="dropdown-list">
              {filteredDistTags && (
                <>
                  <SelectorGroupHeader>Dist tags</SelectorGroupHeader>
                  {filteredDistTags.map(([tag, version]) => (
                    <SelectorItemHoverEffect key={tag} onPressIn={() => handleSelect(tag)}>
                      <View className="px-2.5 py-1.5">
                        <Label
                          className={cx(
                            'text-[inherit]',
                            cx(selectedVersion === tag && 'text-primary-darker dark:text-primary')
                          )}>
                          {tag}
                        </Label>
                        <Label className="text-secondary text-[10px] font-thin">{version}</Label>
                      </View>
                    </SelectorItemHoverEffect>
                  ))}
                  {filteredVersions.length > 0 && (
                    <View className="border-palette-gray2 dark:border-border mt-1 border-b" />
                  )}
                </>
              )}
              {filteredVersions.length > 0 && (
                <>
                  <SelectorGroupHeader>Versions</SelectorGroupHeader>
                  {filteredVersions.map(version => (
                    <SelectorItemHoverEffect key={version} onPressIn={() => handleSelect(version)}>
                      <Label
                        className={cx(
                          'px-2.5 py-1.5 text-[inherit]',
                          cx(selectedVersion === version && 'text-primary-darker dark:text-primary')
                        )}>
                        {version}
                      </Label>
                    </SelectorItemHoverEffect>
                  ))}
                </>
              )}
              {filteredVersions.length === 0 && !filteredDistTags && (
                <View className="px-2.5 py-3">
                  <Label className="text-secondary text-center font-thin">No versions match</Label>
                </View>
              )}
            </ScrollView>
          </View>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function getFilteredDistTags(data: PackageVersionsOnlyData | undefined, query: string) {
  if (!data?.['dist-tags']) {
    return null;
  }

  const entries = Object.entries(data['dist-tags']);
  if (!query) {
    return entries;
  }

  const filtered = entries.filter(
    ([tag, version]) => tag.includes(query) || version.includes(query)
  );

  return filtered.length > 0 ? filtered : null;
}
