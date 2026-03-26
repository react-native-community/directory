import { useRouter } from 'next/router';
import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { type ColorValue, type StyleProp, TextInput, View, type ViewStyle } from 'react-native';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';

import { Caption, Label, useLayout } from '~/common/styleguide';
import InputKeyHint from '~/components/InputKeyHint';
import { type APIResponseType } from '~/types';
import isAppleDevice from '~/util/isAppleDevice';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

import { Search as SearchIcon, Spinner } from './Icons';
import QuickSearchResult from './QuickSearchResult';

type Props = {
  style?: StyleProp<ViewStyle>;
};

const RESULTS_LIMIT = 5;

export default function QuickSearch({ style }: Props) {
  const [isInputFocused, setInputFocused] = useState(false);
  const [activeResultIndex, setActiveResultIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const isApple = useMemo<boolean>(() => isAppleDevice(), []);
  const inputRef = useRef<TextInput>(null);

  const { push } = useRouter();
  const { isSmallScreen } = useLayout();

  const { data, isLoading } = useSWR<APIResponseType | undefined>(
    search.length ? `/api/libraries?search=${search}&limit=${RESULTS_LIMIT}` : undefined,
    (url: string) => fetch(url).then(res => res.json()),
    {
      revalidateOnFocus: false,
    }
  );
  const libraries = useMemo(() => data?.libraries ?? [], [data?.libraries]);
  const hasResults = Boolean(data?.total && data.total > 0);
  const shouldShowResults = search.length > 0 && isInputFocused;

  useEffect(() => {
    if (isApple !== null) {
      document.addEventListener('keydown', keyDownListener, false);
      return () => document.removeEventListener('keydown', keyDownListener);
    }
  }, [isApple]);

  useEffect(() => {
    if (!shouldShowResults || libraries.length === 0) {
      setActiveResultIndex(null);
      return;
    }

    if (activeResultIndex !== null && activeResultIndex >= libraries.length) {
      setActiveResultIndex(libraries.length - 1);
    }
  }, [activeResultIndex, libraries.length, shouldShowResults]);

  const keyDownListener = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === 'k' && (isApple ? event.metaKey : event.ctrlKey)) {
      event.preventDefault();
      inputRef.current?.focus();
    }
  });

  const typingCallback = useDebouncedCallback((text: string) => {
    setSearch(text);
  }, 200);

  const handleSearchChange = useCallback(
    (text: string) => {
      setActiveResultIndex(null);
      typingCallback(text);
    },
    [typingCallback]
  );

  const handleInputFocus = useCallback(() => {
    setInputFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setInputFocused(false);
    setActiveResultIndex(null);
  }, []);

  const handleResultHoverChange = useCallback((index: number | null) => {
    setActiveResultIndex(index);
  }, []);

  const handleArrowDownPress = useCallback(() => {
    setActiveResultIndex(currentIndex => {
      if (libraries.length === 0) {
        return null;
      }

      if (currentIndex === null) {
        return 0;
      }

      return Math.min(currentIndex + 1, libraries.length - 1);
    });
  }, [libraries.length]);

  const handleArrowUpPress = useCallback(() => {
    setActiveResultIndex(currentIndex => {
      if (libraries.length === 0) {
        return null;
      }

      if (currentIndex === null) {
        return libraries.length - 1;
      }

      return Math.max(currentIndex - 1, 0);
    });
  }, [libraries.length]);

  const handleResultSelect = useCallback(
    async (npmPkg: string) => {
      setInputFocused(false);
      inputRef.current?.blur();
      setActiveResultIndex(null);
      await push(urlWithQuery(`/package/${npmPkg}`));
    },
    [push]
  );

  return (
    <>
      <View style={[tw`items-center bg-palette-gray6 py-3.5 dark:bg-dark`, style]}>
        <View style={tw`relative z-20 w-full max-w-layout px-5`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`pointer-events-none absolute left-4`}>
              {isLoading ? (
                <Spinner style={tw`-ml-0.5 text-primary`} />
              ) : (
                <SearchIcon style={isInputFocused ? tw`text-primary` : tw`text-white`} />
              )}
            </View>
            <TextInput
              ref={inputRef}
              id="search"
              autoComplete="off"
              onKeyPress={event => {
                if ('key' in event) {
                  if (typeof event.key !== 'string') {
                    return;
                  }

                  if (event.key === 'ArrowDown') {
                    if (shouldShowResults && hasResults) {
                      event.preventDefault();
                      handleArrowDownPress();
                    }
                  }

                  if (event.key === 'ArrowUp') {
                    if (shouldShowResults && hasResults) {
                      event.preventDefault();
                      handleArrowUpPress();
                    }
                  }

                  if (event.key === 'Enter') {
                    event.preventDefault();

                    if (activeResultIndex !== null && libraries[activeResultIndex]) {
                      void handleResultSelect(libraries[activeResultIndex].npmPkg);
                      return;
                    }

                    void push(urlWithQuery('/packages', { search }));
                  }

                  if (
                    event.key === 'k' &&
                    (('metaKey' in event && event.metaKey) || ('ctrlKey' in event && event.ctrlKey))
                  ) {
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
                      setSearch('');
                    } else {
                      inputRef.current.blur();
                    }
                  }
                }
              }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChangeText={handleSearchChange}
              placeholder="Search libraries..."
              style={tw`h-12.5 font-sans pr-30 flex flex-1 rounded-md border-2 border-palette-gray5 bg-palette-gray6 p-4 pl-11 text-xl text-white -outline-offset-2 dark:border-default dark:bg-dark`}
              placeholderTextColor={tw`text-palette-gray4`.color as ColorValue}
            />
            {!isSmallScreen && (
              <View style={tw`pointer-events-none absolute right-4 flex-row items-center gap-1`}>
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
        </View>
        {shouldShowResults && (
          <View
            id="quick-search-results"
            style={tw`absolute inset-x-5 top-[60px] z-10 rounded-b border-2 border-t-0 border-pewter shadow-xl dark:border-default`}>
            {hasResults && (
              <View style={tw`pb-1.5 pt-2`}>
                {libraries.map((lib, index) => (
                  <QuickSearchResult
                    key={lib.npmPkg}
                    index={index}
                    library={lib}
                    isActive={activeResultIndex === index}
                    onHoverChange={handleResultHoverChange}
                    onSelect={handleResultSelect}
                  />
                ))}
              </View>
            )}
            {hasResults && (data?.total ?? 0) > RESULTS_LIMIT && (
              <View
                style={[
                  tw`flex flex-row items-center gap-1.5 rounded-b border-t border-default bg-palette-gray1 px-3 py-1.5 dark:bg-dark`,
                  isSmallScreen ? tw`justify-center` : tw`justify-end`,
                ]}>
                <Label style={tw`font-light text-palette-gray4`}>
                  There are{' '}
                  <span style={tw`font-medium text-primary-darker dark:text-primary`}>
                    {(data?.total ?? 0) - RESULTS_LIMIT}
                  </span>{' '}
                  more results
                  {!isSmallScreen && (
                    <>
                      , press <span style={tw`font-medium`}>Enter</span> to see all of them
                    </>
                  )}
                </Label>
              </View>
            )}
            {!hasResults && (
              <Caption style={tw`pb-4.5 pt-5.5 text-center font-light text-secondary`}>
                There are no results for &quot;{search}&quot; query.
              </Caption>
            )}
          </View>
        )}
      </View>
    </>
  );
}
