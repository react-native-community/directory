import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type ColorValue, TextInput, View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

import { Caption, H6Section, Label, useLayout } from '~/common/styleguide';
import { Button } from '~/components/Button';
import { Search } from '~/components/Icons';
import InputKeyHint from '~/components/InputKeyHint';
import { type NpmPerVersionDownloads, type NpmRegistryData } from '~/types';
import { parseQueryParams, replaceQueryParam } from '~/util/queryParams';
import { pluralize } from '~/util/strings';
import tw from '~/util/tailwind';

import VersionBox from './VersionBox';

const VERSIONS_TO_SHOW = 25;

type Props = {
  registryData: NpmRegistryData;
  npmDownloads?: NpmPerVersionDownloads;
};

export default function VersionsSection({ registryData, npmDownloads }: Props) {
  const router = useRouter();
  const { isSmallScreen } = useLayout();

  const [shouldShowAll, setShowAll] = useState(false);
  const [isInputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const routeVersionSearch = useMemo(
    () => parseQueryParams(router.query).versionSearch?.toLowerCase() ?? '',
    [router.query]
  );
  const [versionSearch, setVersionSearch] = useState(routeVersionSearch);

  useEffect(() => {
    setVersionSearch(currentVersionSearch =>
      currentVersionSearch === routeVersionSearch ? currentVersionSearch : routeVersionSearch
    );
  }, [routeVersionSearch]);

  useEffect(() => setShowAll(false), [versionSearch]);

  const versions = useMemo(
    () =>
      Object.entries(registryData.versions).sort(
        (a, b) => -registryData.time[a[1].version].localeCompare(registryData.time[b[1].version])
      ),
    [registryData]
  );

  const filteredVersions = useMemo(
    () =>
      versionSearch
        ? versions.filter(([version, versionData]) =>
            [version, versionData.version].some(value =>
              value.toLowerCase().includes(versionSearch)
            )
          )
        : versions,
    [versionSearch, versions]
  );
  const visibleVersions = useMemo(
    () => filteredVersions.slice(0, shouldShowAll ? filteredVersions.length : VERSIONS_TO_SHOW),
    [filteredVersions, shouldShowAll]
  );

  const updateVersionSearchQuery = useDebouncedCallback((versionSearch: string) => {
    replaceQueryParam(router, 'versionSearch', versionSearch);
  }, 200);

  return (
    <>
      <H6Section style={tw`mt-3 flex items-end justify-between text-secondary`}>
        <span>Versions</span>
        <Label style={tw`font-light text-secondary`}>
          <span style={tw`font-medium text-primary-darker dark:text-primary-dark`}>
            {filteredVersions.length}
          </span>{' '}
          matching {pluralize('version', filteredVersions.length)}
        </Label>
      </H6Section>
      <View style={tw`gap-2`}>
        <View
          style={tw`flex-row items-center rounded-lg border-2 border-default bg-palette-gray1 dark:bg-dark`}>
          <View style={tw`pointer-events-none absolute left-4`}>
            <Search style={tw`text-icon`} />
          </View>
          <TextInput
            ref={inputRef}
            id="version-search"
            autoComplete="off"
            value={versionSearch}
            onChangeText={text => {
              setVersionSearch(text);
              updateVersionSearchQuery(text.trim());
            }}
            onKeyPress={event => {
              if ('key' in event) {
                if (inputRef.current && event.key === 'Escape') {
                  if (versionSearch) {
                    event.preventDefault();
                    inputRef.current.clear();
                    setVersionSearch('');
                    replaceQueryParam(router, 'versionSearch', undefined);
                  } else {
                    inputRef.current.blur();
                  }
                }
              }
            }}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Filter versions…"
            style={tw`h-11 flex-1 rounded-lg bg-palette-gray1 p-3 pl-11 text-base text-black dark:bg-dark dark:text-white`}
            placeholderTextColor={tw`text-palette-gray4`.color as ColorValue}
          />
          {!isSmallScreen && (
            <View style={tw`pointer-events-none absolute right-4 flex-row items-center gap-1`}>
              {isInputFocused && (
                <InputKeyHint
                  content={[
                    { label: 'press' },
                    { key: 'Esc' },
                    { label: `to ${(versionSearch?.length ?? 0) > 0 ? 'clear' : 'blur'}` },
                  ]}
                />
              )}
            </View>
          )}
        </View>
      </View>
      <View style={tw`gap-2`}>
        {visibleVersions.length ? (
          visibleVersions.map(([version, versionData]) => (
            <VersionBox
              key={version}
              time={registryData.time[versionData.version]}
              versionData={versionData}
              downloads={npmDownloads?.downloads[versionData.version]}
            />
          ))
        ) : (
          <View style={tw`rounded-xl border border-dashed border-default px-4 py-5`}>
            <Label style={tw`text-center text-secondary`}>
              No versions match &quot;{versionSearch?.trim()}&quot; query.
            </Label>
          </View>
        )}
      </View>
      {!shouldShowAll && filteredVersions.length > VERSIONS_TO_SHOW && (
        <Button onPress={() => setShowAll(true)} style={tw`mx-auto mt-2 px-4 py-2`}>
          <Caption style={tw`text-white`}>Show all versions</Caption>
        </Button>
      )}
    </>
  );
}
