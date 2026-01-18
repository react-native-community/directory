import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState, useEffectEvent } from 'react';
import { type ColorValue, type StyleProp, TextInput, View, type ViewStyle } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

import { P, useLayout, Label } from '~/common/styleguide';
import { type Query } from '~/types';
import isAppleDevice from '~/util/isAppleDevice';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

import { Filters } from './Filters';
import { FilterButton } from './Filters/FilterButton';
import { Search as SearchIcon } from './Icons';
import { SortButton } from './Sort';

type Props = {
  query: Query;
  total: number;
  style?: StyleProp<ViewStyle>;
  isHomePage?: boolean;
};

export default function Search({ query, total, style, isHomePage = false }: Props) {
  const { search, order, direction, offset, owner, ...filterParams } = query;
  const [isInputFocused, setInputFocused] = useState(false);
  const [isFilterVisible, setFilterVisible] = useState(Object.keys(filterParams).length > 0);

  const isApple = useMemo<boolean>(() => isAppleDevice(), []);
  const inputRef = useRef<TextInput>(null);

  const { replace } = useRouter();
  const { isSmallScreen } = useLayout();

  useEffect(() => {
    // @ts-expect-error using native input value to clear on same-page navigation
    if (!isInputFocused && inputRef?.current?.value && !search) {
      inputRef.current.clear();
    }
  }, [search, isInputFocused]);

  const keyDownListener = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === 'k' && (isApple ? event.metaKey : event.ctrlKey)) {
      event.preventDefault();
      inputRef.current?.focus();
    }
  });

  useEffect(() => {
    if (isApple !== null) {
      document.addEventListener('keydown', keyDownListener, false);
      return () => document.removeEventListener('keydown', keyDownListener);
    }
  }, [isApple]);

  const typingCallback = useDebouncedCallback((text: string) => {
    void replace(urlWithQuery('/packages', { ...query, search: text, offset: null }));
  }, 200);

  function handleClearAllPress() {
    void replace(urlWithQuery('/packages', { search, offset: undefined }));
  }

  const focusHintLabel = tw`text-palette-gray4 font-light`;
  const focusHintKey = tw`text-tertiary text-center py-[3px] px-1 min-w-6 rounded-[3px] tracking-[0.75px] bg-palette-gray5 dark:bg-powder`;

  return (
    <>
      <View style={[tw`py-3.5 items-center bg-palette-gray6 dark:bg-dark`, style]}>
        <View style={tw`w-full max-w-layout px-4`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`absolute left-4 pointer-events-none`}>
              <SearchIcon style={tw`text-white`} />
            </View>
            <TextInput
              ref={inputRef}
              id="search"
              autoComplete="off"
              onKeyPress={event => {
                if ('key' in event) {
                  if (isHomePage && event.key === 'Enter') {
                    event.preventDefault();
                    void replace(
                      urlWithQuery('/packages', {
                        ...query,
                        // @ts-expect-error using native input value
                        search: inputRef.current.value,
                        offset: undefined,
                      })
                    );
                  }
                  if (
                    event.key === 'k' &&
                    (('metaKey' in event && event.metaKey) || ('ctrlKey' in event && event.ctrlKey))
                  ) {
                    event.preventDefault();
                  }
                  if (inputRef.current && event.key === 'Escape') {
                    if (search) {
                      event.preventDefault();
                      inputRef.current.clear();
                      void replace(
                        urlWithQuery('/packages', {
                          ...query,
                          search: undefined,
                          offset: undefined,
                        })
                      );
                    } else {
                      inputRef.current.blur();
                    }
                  }
                }
              }}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onChangeText={isHomePage ? undefined : typingCallback}
              placeholder="Search libraries..."
              style={tw`flex flex-1 h-12.5 p-4 pl-11 font-sans text-xl text-white rounded-md -outline-offset-2 border-2 border-palette-gray5 bg-palette-gray6 dark:bg-dark dark:border-default`}
              defaultValue={search}
              placeholderTextColor={tw`text-palette-gray4`.color as ColorValue}
            />
            {!isSmallScreen && (
              <View style={tw`absolute right-4 pointer-events-none flex-row gap-1 items-center`}>
                {isInputFocused ? (
                  <>
                    <Label style={focusHintLabel}>press</Label>
                    {isHomePage ? (
                      <>
                        <Label style={focusHintKey}>Enter</Label>
                        <Label style={focusHintLabel}>to search</Label>
                      </>
                    ) : (
                      <>
                        <Label style={focusHintKey}>Esc</Label>
                        <Label style={focusHintLabel}>
                          to {(search?.length ?? 0) > 0 ? 'clear' : 'blur'}
                        </Label>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Label style={focusHintKey}>{isApple ? 'Cmd' : 'Ctrl'}</Label>
                    <Label style={focusHintLabel}>+</Label>
                    <Label style={focusHintKey}>K</Label>
                  </>
                )}
              </View>
            )}
          </View>
          {!isHomePage && (
            <View
              style={[
                tw`flex-row items-center mt-2 justify-between`,
                isSmallScreen && tw`flex-col items-start`,
              ]}>
              {total ? (
                <P style={tw`mt-1 text-white`}>
                  <P style={tw`text-primary font-bold`}>{total}</P>{' '}
                  {total === 1 ? 'entry' : 'entries'}
                </P>
              ) : (
                <P />
              )}
              <View style={[tw`flex-row items-center mt-1.5`, isSmallScreen && tw`mt-2.5`]}>
                <FilterButton
                  style={tw`h-6`}
                  query={query}
                  onPress={() => setFilterVisible(!isFilterVisible)}
                  onClearAllPress={handleClearAllPress}
                  isFilterVisible={isFilterVisible}
                />
                <SortButton query={query} />
              </View>
            </View>
          )}
        </View>
      </View>
      {isFilterVisible && <Filters query={query} />}
    </>
  );
}
