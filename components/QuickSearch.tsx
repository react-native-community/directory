import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import {
  type ColorValue,
  type StyleProp,
  TextInput,
  type TextInputInstance,
  View,
  type ViewStyle,
} from 'react-native';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';

import { Caption, Label, useLayout } from '~/common/styleguide';
import InputKeyHint from '~/components/InputKeyHint';
import { useQuickSearchState } from '~/context/QuickSearchState';
import {
  isSearchShortcutPressed,
  useSearchInputFocus,
  useSearchShortcut,
} from '~/hooks/useSearchInput';
import { type APIResponseType } from '~/types';
import { cx } from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

import { SearchIcon, SpinnerIcon } from './Icons';
import QuickSearchResult from './QuickSearchResult';

type Props = {
  className?: string;
  focusOnMount?: boolean;
  style?: StyleProp<ViewStyle>;
};

const RESULTS_LIMIT = 5;

export default function QuickSearch({ className, focusOnMount = false, style }: Props) {
  const [activeResultIndex, setActiveResultIndex] = useState<number | null>(null);
  const { searchValue, setSearchValue } = useQuickSearchState();
  const [search, setSearch] = useState(searchValue);

  const inputRef = useRef<TextInputInstance>(null);
  const searchRef = useRef(searchValue);
  const isApple = useSearchShortcut(inputRef);
  const { isInputFocused, handleInputFocus, handleInputBlur } = useSearchInputFocus();

  const { push } = useRouter();
  const { isSmallScreen } = useLayout();

  useEffect(() => {
    if (focusOnMount) {
      inputRef.current?.focus();
    }
  }, [focusOnMount]);

  const { data, isLoading } = useSWR<APIResponseType | undefined>(
    search.length ? `/api/libraries?search=${search}&limit=${RESULTS_LIMIT}` : undefined,
    (url: string) => fetch(url).then(res => res.json()),
    {
      revalidateOnFocus: false,
    }
  );
  const libraries = data?.libraries ?? [];
  const hasResults = Boolean(data?.total && data.total > 0);
  const shouldShowResults = search.length > 0 && isInputFocused;
  const effectiveActiveResultIndex =
    activeResultIndex !== null && activeResultIndex < libraries.length ? activeResultIndex : null;

  const typingCallback = useDebouncedCallback((text: string) => {
    setSearch(text);
  }, 200);

  function handleSearchChange(text: string) {
    searchRef.current = text;
    setSearchValue(text);
    setActiveResultIndex(null);
    typingCallback(text);
  }

  function handleSearchInputBlur() {
    handleInputBlur();
    setActiveResultIndex(null);
  }

  function handleResultHoverChange(index: number | null) {
    setActiveResultIndex(index);
  }

  function handleArrowDownPress() {
    setActiveResultIndex(currentIndex => {
      if (libraries.length === 0) {
        return null;
      }

      if (currentIndex === null) {
        return 0;
      }

      return Math.min(currentIndex + 1, libraries.length - 1);
    });
  }

  function handleArrowUpPress() {
    setActiveResultIndex(currentIndex => {
      if (libraries.length === 0) {
        return null;
      }

      if (currentIndex === null) {
        return libraries.length - 1;
      }

      return Math.max(currentIndex - 1, 0);
    });
  }

  async function handleResultSelect(npmPkg: string) {
    handleInputBlur();
    inputRef.current?.blur();
    setActiveResultIndex(null);
    await push(urlWithQuery(`/package/${npmPkg}`));
  }

  return (
    <View
      className={cx('items-center bg-palette-gray6 py-3.5 dark:bg-dark', className)}
      style={style}>
      <View className="max-w-layout relative z-20 w-full px-5">
        <View className="relative z-30 flex-row items-center">
          <View className="pointer-events-none absolute left-4">
            {isLoading ? (
              <SpinnerIcon className="text-primary -ml-0.5" />
            ) : (
              <SearchIcon className={cx(isInputFocused ? 'text-primary' : 'text-white')} />
            )}
          </View>
          <TextInput
            ref={inputRef}
            id="quick-search"
            autoComplete="off"
            onKeyPress={event => {
              if (!('key' in event)) {
                return;
              }
              if (typeof event.key !== 'string') {
                return;
              }
              if (event.key === 'ArrowDown' && shouldShowResults && hasResults) {
                event.preventDefault();
                handleArrowDownPress();
              }
              if (event.key === 'ArrowUp' && shouldShowResults && hasResults) {
                event.preventDefault();
                handleArrowUpPress();
              }
              if (event.key === 'Enter') {
                event.preventDefault();

                if (effectiveActiveResultIndex !== null && libraries[effectiveActiveResultIndex]) {
                  void handleResultSelect(libraries[effectiveActiveResultIndex].npmPkg);
                  return;
                }

                void push(urlWithQuery('/packages', { search: searchRef.current }));
              }
              if (isSearchShortcutPressed(event)) {
                event.preventDefault();
              }
              if (inputRef.current && event.key === 'Escape') {
                if (activeResultIndex !== null) {
                  event.preventDefault();
                  setActiveResultIndex(null);
                  return;
                }

                if (search) {
                  event.preventDefault();
                  inputRef.current.clear();
                  searchRef.current = '';
                  setSearchValue('');
                  setSearch('');
                } else {
                  inputRef.current.blur();
                }
              }
            }}
            onFocus={handleInputFocus}
            onBlur={handleSearchInputBlur}
            onChangeText={handleSearchChange}
            value={searchValue}
            placeholder="Search libraries…"
            className="border-palette-gray5 bg-palette-gray6 dark:border-border dark:bg-dark flex h-12.5 flex-1 rounded-md border-2 p-4 pr-30 pl-11 font-sans text-xl text-white -outline-offset-2"
            placeholderTextColor={'var(--gray-4)' as ColorValue}
          />
          {!isSmallScreen && (
            <View className="pointer-events-none absolute right-4 flex-row items-center gap-1">
              {isInputFocused ? (
                <InputKeyHint
                  content={[
                    { label: 'press' },
                    { key: 'Enter' },
                    {
                      label:
                        activeResultIndex !== null
                          ? 'to open highlighted result'
                          : 'to see all results',
                    },
                  ]}
                />
              ) : (
                <InputKeyHint
                  content={[{ key: isApple ? 'Cmd' : 'Ctrl' }, { label: '+' }, { key: 'K' }]}
                />
              )}
            </View>
          )}
        </View>
        {shouldShowResults && (
          <View
            id="quick-search-results"
            className="border-pewter dark:border-border absolute inset-x-5 top-[46px] z-10 rounded-b border-2 border-t-0 shadow-xl">
            {hasResults && (
              <View className="pt-2 pb-1.5">
                {libraries.map((lib, index) => (
                  <QuickSearchResult
                    key={lib.npmPkg}
                    index={index}
                    library={lib}
                    isActive={effectiveActiveResultIndex === index}
                    onHoverChange={handleResultHoverChange}
                    onSelect={handleResultSelect}
                  />
                ))}
              </View>
            )}
            {hasResults && (data?.total ?? 0) > RESULTS_LIMIT && (
              <View
                className={cx(
                  'flex flex-row items-center gap-1.5 rounded-b border-t border-border bg-palette-gray1 px-3 py-1.5 dark:bg-dark',
                  cx(isSmallScreen ? 'justify-center' : 'justify-end')
                )}>
                <Label className="text-palette-gray4 font-light">
                  There are{' '}
                  <span className="text-primary-darker dark:text-primary font-medium">
                    {(data?.total ?? 0) - RESULTS_LIMIT}
                  </span>{' '}
                  more results
                  {!isSmallScreen && (
                    <>
                      , press <span className="font-medium">Enter</span> to see all of them
                    </>
                  )}
                </Label>
              </View>
            )}
            {!hasResults && (
              <Caption className="text-secondary pt-5.5 pb-4.5 text-center font-light">
                There are no results for &quot;{search}&quot; query.
              </Caption>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
