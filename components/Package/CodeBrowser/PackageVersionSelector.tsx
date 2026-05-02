import * as Popover from '@radix-ui/react-popover';
import { useMemo, useRef, useState } from 'react';
import { type ColorValue, ScrollView, TextInput, View } from 'react-native';
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';

import { Label } from '~/common/styleguide';
import { ArrowIcon } from '~/components/Icons';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import SelectorGroupHeader from '~/components/Selector/SelectorGroupHeader';
import SelectorItemHoverEffect from '~/components/Selector/SelectorItemHoverEffect';
import { type PackageVersionsOnlyData } from '~/types';
import { TimeRange } from '~/util/datetime';
import tw from '~/util/tailwind';

type Props = {
  packageName: string;
  selectedVersion: string;
  setVersion: (selectedVersion: string) => void;
};

export default function PackageVersionSelector({
  packageName,
  selectedVersion,
  setVersion,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 150);
  const inputRef = useRef<TextInput>(null);

  const { data, isLoading } = useSWR<PackageVersionsOnlyData>(
    `/api/proxy/npm-registry-versions?name=${packageName}&versionsOnly=true`,
    (url: string) => fetch(url).then(res => res.json()),
    {
      dedupingInterval: TimeRange.HOUR * 1000,
      revalidateOnFocus: false,
    }
  );

  const filteredVersions = useMemo(() => {
    const query = debouncedSearch.trim();
    if (!query) {
      return data?.versions ?? [];
    }
    return (data?.versions ?? []).filter(v => v.includes(query));
  }, [data?.versions, debouncedSearch]);

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
      <Popover.Trigger asChild>
        <View
          style={tw`min-h-8 w-[180px] cursor-pointer justify-center overflow-hidden rounded-lg border border-palette-gray2 bg-default px-2 dark:border-default dark:bg-dark`}>
          {isLoading ? (
            <View style={tw`scale-75 text-center`}>
              <ThreeDotsLoader />
            </View>
          ) : (
            <View style={tw`flex-row items-center justify-between gap-1.5`}>
              <Label numberOfLines={1} style={tw`select-none text-[13px]`}>
                {selectedVersion}
              </Label>
              <ArrowIcon
                style={[tw`h-3 w-4 shrink-0 text-icon`, open ? tw`rotate-270` : tw`rotate-90`]}
              />
            </View>
          )}
        </View>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={6}>
          <View
            style={tw`w-56 overflow-hidden rounded-lg border border-palette-gray2 bg-default shadow-lg dark:border-default`}>
            <View style={tw`border-b border-palette-gray2 dark:border-default`}>
              <TextInput
                ref={inputRef}
                value={search}
                onChangeText={setSearch}
                placeholder="Filter versions…"
                style={tw`px-2.5 py-1.5 text-sm text-black outline-0 dark:text-white`}
                autoCorrect={false}
                autoCapitalize="none"
                placeholderTextColor={
                  tw.prefixMatch('dark')
                    ? (tw`text-palette-gray5`.color as ColorValue)
                    : (tw`text-palette-gray3`.color as ColorValue)
                }
              />
            </View>
            <ScrollView style={tw`max-h-76`} keyboardShouldPersistTaps="handled" id="dropdown-list">
              {data?.['dist-tags'] && !debouncedSearch.trim() && (
                <>
                  <SelectorGroupHeader>Dist tags</SelectorGroupHeader>
                  {Object.entries(data['dist-tags']).map(([tag, version]) => (
                    <SelectorItemHoverEffect key={tag}>
                      <View onPointerDown={() => handleSelect(tag)}>
                        <Label
                          style={[
                            tw`text-[inherit]`,
                            selectedVersion === tag && tw`text-primary-darker dark:text-primary`,
                          ]}>
                          {tag}
                        </Label>
                        <Label style={tw`text-[10px] font-thin text-secondary`}>{version}</Label>
                      </View>
                    </SelectorItemHoverEffect>
                  ))}
                  <View style={tw`mt-1 border-b border-palette-gray2 dark:border-default`} />
                </>
              )}
              {filteredVersions.length === 0 ? (
                <View style={tw`px-3 py-2`}>
                  <Label style={tw`text-center font-thin text-secondary`}>No versions match</Label>
                </View>
              ) : (
                <>
                  <SelectorGroupHeader>Versions</SelectorGroupHeader>
                  {filteredVersions.map(version => (
                    <SelectorItemHoverEffect key={version}>
                      <View onPointerDown={() => handleSelect(version)}>
                        <Label
                          style={[
                            tw`text-[inherit]`,
                            selectedVersion === version &&
                              tw`text-primary-darker dark:text-primary`,
                          ]}>
                          {version}
                        </Label>
                      </View>
                    </SelectorItemHoverEffect>
                  ))}
                </>
              )}
            </ScrollView>
          </View>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
