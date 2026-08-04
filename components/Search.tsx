import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { type ColorValue, type StyleProp, TextInput, View, type ViewStyle } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

import { P, useLayout } from '~/common/styleguide';
import InputKeyHint from '~/components/InputKeyHint';
import {
  isSearchShortcutPressed,
  useSearchInputFocus,
  useSearchShortcut,
} from '~/hooks/useSearchInput';
import { type Query } from '~/types';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

import { Filters } from './Filters';
import { FilterButton } from './Filters/FilterButton';
import { SearchIcon } from './Icons';
import { SortButton } from './Sort';

type Props = {
  query: Query;
  total: number;
  style?: StyleProp<ViewStyle>;
};

export default function Search({ query, total, style }: Props) {
  const { search, order, direction, offset, owner, ...filterParams } = query;
  const [isFilterVisible, setFilterVisible] = useState(Object.keys(filterParams).length > 0);

  const inputRef = useRef<TextInput>(null);
  const isApple = useSearchShortcut(inputRef);
  const { isInputFocused, handleInputFocus, handleInputBlur } = useSearchInputFocus();

  const { replace } = useRouter();
  const { isSmallScreen } = useLayout();

  useEffect(() => {
    // @ts-expect-error using native input value to clear on same-page navigation
    if (!isInputFocused && inputRef?.current?.value && !search) {
      inputRef.current.clear();
    }
  }, [search, isInputFocused]);

  const typingCallback = useDebouncedCallback((text: string) => {
    void replace(urlWithQuery('/packages', { ...query, search: text, offset: null }));
  }, 200);

  function handleClearAllPress() {
    void replace(urlWithQuery('/packages', { search, offset: undefined }));
  }

  return (
    <>
      <View style={[tw`items-center bg-palette-gray6 py-3.5 dark:bg-dark`, style]}>
        <View style={tw`w-full max-w-layout px-4`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`pointer-events-none absolute left-4`}>
              <SearchIcon style={isInputFocused ? tw`text-primary` : tw`text-white`} />
            </View>
            <TextInput
              ref={inputRef}
              id="search"
              autoComplete="off"
              onKeyPress={event => {
                if ('key' in event) {
                  if (isSearchShortcutPressed(event)) {
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
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChangeText={typingCallback}
              placeholder="Search libraries…"
              style={tw`h-12.5 font-sans pr-30 flex flex-1 rounded-md border-2 border-palette-gray5 bg-palette-gray6 p-4 pl-11 text-xl text-white -outline-offset-2 dark:border-default dark:bg-dark`}
              defaultValue={search}
              placeholderTextColor={tw`text-palette-gray4`.color as ColorValue}
            />
            {!isSmallScreen && (
              <View style={tw`pointer-events-none absolute right-4 flex-row items-center gap-1`}>
                {isInputFocused ? (
                  <InputKeyHint
                    content={[
                      { label: 'press' },
                      { key: 'Esc' },
                      { label: `to ${(search?.length ?? 0) > 0 ? 'clear' : 'blur'}` },
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
          <View
            style={[
              tw`mt-2 flex-row items-center justify-between`,
              isSmallScreen && tw`flex-col items-start`,
            ]}>
            {total ? (
              <P style={tw`mt-1 text-white`}>
                <P style={tw`font-bold text-primary`}>{total}</P>{' '}
                {total === 1 ? 'entry' : 'entries'}
              </P>
            ) : (
              <P />
            )}
            <View style={[tw`mt-1.5 flex-row items-center`, isSmallScreen && tw`mt-2.5`]}>
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
        </View>
      </View>
      {isFilterVisible && <Filters query={query} />}
    </>
  );
}
