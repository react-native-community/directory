import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { type ColorValue, TextInput, type TextInputInstance, View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

import { H6Section, Label, useLayout } from '~/common/styleguide';
import { SearchIcon } from '~/components/Icons';
import InputKeyHint from '~/components/InputKeyHint';
import Pagination from '~/components/Pagination';
import {
  isSearchShortcutPressed,
  useSearchInputFocus,
  useSearchShortcut,
} from '~/hooks/useSearchInput';
import { type NpmPerVersionDownloads, type PackageVersionsData } from '~/types';
import { NUM_PER_PAGE } from '~/util/Constants';
import { parseQueryParams, replaceQueryParams } from '~/util/queryParams';
import { pluralize } from '~/util/strings';
import { cx } from '~/util/tailwind';

import VersionBox from './VersionBox';

const VERSIONS_SECTION_ID = 'versions';

type Props = {
  registryData: PackageVersionsData;
  npmDownloads?: NpmPerVersionDownloads;
};

export default function VersionsSection({ registryData, npmDownloads }: Props) {
  const router = useRouter();
  const { isSmallScreen } = useLayout();

  const inputRef = useRef<TextInputInstance>(null);
  const isApple = useSearchShortcut(inputRef);
  const { isInputFocused, handleInputFocus, handleInputBlur } = useSearchInputFocus();

  const routeParams = parseQueryParams(router.query);
  const routeVersionSearch = routeParams.versionSearch?.toLowerCase() ?? '';
  const [versionSearch, setVersionSearch] = useState(routeVersionSearch);

  const versions = Object.entries(registryData.versions).sort(
    (a, b) => -registryData.time[a[1].version].localeCompare(registryData.time[b[1].version])
  );
  const filteredVersions = versions.filter(([version, versionData]) =>
    [version, versionData.version].some(value => value.toLowerCase().includes(versionSearch))
  );

  function replaceVersionSearchQuery(versionSearch: string) {
    replaceQueryParams(router, { versionSearch, offset: undefined });
  }
  const updateVersionSearchQuery = useDebouncedCallback(replaceVersionSearchQuery, 200);

  const offset = routeParams.offset ? Number.parseInt(routeParams.offset, 10) : 0;
  const visibleVersions = filteredVersions.slice(offset, offset + NUM_PER_PAGE);
  const versionsQuery = { versionSearch, offset: offset.toString() };
  const versionsPath = `/package/${registryData.name}/versions`;

  return (
    <>
      <H6Section
        id={VERSIONS_SECTION_ID}
        className={cx('mt-3 flex items-end justify-between scroll-m-4 text-secondary')}>
        <span>Versions</span>
        {filteredVersions.length > 0 && (
          <Label className="text-secondary font-light">
            <span className="text-primary-darker dark:text-primary-dark font-medium">
              {filteredVersions.length}
            </span>{' '}
            matching {pluralize('version', filteredVersions.length)}
          </Label>
        )}
      </H6Section>
      <View className="gap-2">
        <View className="border-border bg-palette-gray1 dark:bg-dark flex-row items-center rounded-lg border-2">
          <View className="pointer-events-none absolute left-4">
            <SearchIcon className="text-icon" />
          </View>
          <TextInput
            ref={inputRef}
            id="version-search"
            autoComplete="off"
            value={versionSearch}
            onChangeText={text => {
              const normalizedQuery = text.trim();
              setVersionSearch(normalizedQuery);
              updateVersionSearchQuery(normalizedQuery);
            }}
            onKeyPress={event => {
              if (!('key' in event)) {
                return;
              }
              if (isSearchShortcutPressed(event)) {
                event.preventDefault();
              }
              if (inputRef.current && event.key === 'Escape') {
                if (versionSearch) {
                  event.preventDefault();
                  inputRef.current.clear();
                  setVersionSearch('');
                  replaceVersionSearchQuery('');
                } else {
                  inputRef.current.blur();
                }
              }
            }}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Filter versions…"
            className="bg-palette-gray1 dark:bg-dark h-11 flex-1 rounded-lg p-3 pl-11 text-base text-black dark:text-white"
            placeholderTextColor={'var(--gray-4)' as ColorValue}
          />
          {!isSmallScreen && (
            <View className="pointer-events-none absolute right-4 flex-row items-center gap-1">
              {isInputFocused ? (
                <InputKeyHint
                  content={[
                    { label: 'press' },
                    { key: 'Esc' },
                    { label: `to ${(versionSearch?.length ?? 0) > 0 ? 'clear' : 'blur'}` },
                  ]}
                  variableTheme
                />
              ) : (
                <InputKeyHint
                  content={[{ key: isApple ? 'Cmd' : 'Ctrl' }, { label: '+' }, { key: 'K' }]}
                  variableTheme
                />
              )}
            </View>
          )}
        </View>
      </View>
      {filteredVersions.length > NUM_PER_PAGE && (
        <Pagination
          query={versionsQuery}
          total={filteredVersions.length}
          basePath={versionsPath}
          hash={VERSIONS_SECTION_ID}
          shallow
        />
      )}
      <View className="gap-2">
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
          <View className="border-border rounded-xl border border-dashed px-4 py-5">
            <Label className="text-secondary text-center">
              No versions match &quot;{versionSearch?.trim()}&quot; query.
            </Label>
          </View>
        )}
      </View>
      {filteredVersions.length > NUM_PER_PAGE && (
        <Pagination
          query={versionsQuery}
          total={filteredVersions.length}
          basePath={versionsPath}
          hash={VERSIONS_SECTION_ID}
          shallow
          noTags
        />
      )}
    </>
  );
}
