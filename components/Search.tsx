import Router from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

import { layout, colors, P, darkColors, useLayout, Label } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { Query } from '~/types';
import isAppleDevice from '~/util/isAppleDevice';
import urlWithQuery from '~/util/urlWithQuery';

import { Filters } from './Filters';
import { FilterButton } from './Filters/FilterButton';
import { Search as SearchIcon } from './Icons';
import { SortButton } from './Sort';

type Props = {
  query: Query;
  total: number;
};

const Search = ({ query, total }: Props) => {
  const { search, order, direction, ...filterParams } = query;
  const [isInputFocused, setInputFocused] = useState(false);
  const [isFilterVisible, setFilterVisible] = useState(Object.keys(filterParams).length > 0);
  const [isApple, setIsApple] = useState<boolean | null>(null);
  const inputRef = useRef(null);

  const { isSmallScreen } = useLayout();
  const { isDark } = useContext(CustomAppearanceContext);

  useEffect(() => setIsApple(isAppleDevice()), []);

  useEffect(() => {
    if (isApple !== null) {
      const keyDownListener = (event: KeyboardEvent) => {
        if (event.key === 'k' && (isApple ? event.metaKey : event.ctrlKey)) {
          event.preventDefault();
          inputRef.current.focus();
        }
      };
      document.addEventListener('keydown', keyDownListener, false);
      return () => document.removeEventListener('keydown', keyDownListener);
    }
  }, [isApple]);

  const typingCallback = useDebouncedCallback((text: string) => {
    Router.replace(urlWithQuery('/', { ...query, search: text, offset: null }));
  }, 200);

  const handleClearAllPress = () => {
    Router.replace(urlWithQuery('/', { search: query.search, offset: null }));
  };

  return (
    <>
      <View
        style={[
          styles.wrapper,
          {
            backgroundColor: isDark ? darkColors.dark : colors.gray6,
          },
        ]}>
        <View style={styles.container}>
          <View style={styles.displayHorizontal}>
            <View style={styles.searchIcon}>
              <SearchIcon fill={colors.white} />
            </View>
            <TextInput
              ref={inputRef}
              onKeyPress={event => {
                if ('key' in event) {
                  if (
                    event.key === 'k' &&
                    (('metaKey' in event && event.metaKey) || ('ctrlKey' in event && event.ctrlKey))
                  ) {
                    event.preventDefault();
                  }
                  if (event.key === 'Escape') {
                    if (search) {
                      event.preventDefault();
                      inputRef.current.value = '';
                      Router.replace(
                        urlWithQuery('/', {
                          ...query,
                          search: null,
                          offset: null,
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
              onChangeText={typingCallback}
              placeholder="Search libraries..."
              style={[
                styles.textInput,
                {
                  borderColor: isDark ? darkColors.border : colors.gray5,
                },
              ]}
              defaultValue={search}
              placeholderTextColor={colors.gray4}
            />
            {!isSmallScreen &&
              (isInputFocused ? (
                <View style={styles.focusHint}>
                  <Label style={styles.focusHintLabel}>press</Label>
                  <Label
                    style={[
                      styles.focusHintKey,
                      {
                        backgroundColor: isDark ? darkColors.powder : colors.gray5,
                      },
                    ]}>
                    Esc
                  </Label>
                  <Label style={styles.focusHintLabel}>
                    to {search?.length > 0 ? 'clear' : 'blur'}
                  </Label>
                </View>
              ) : (
                <View style={styles.focusHint}>
                  <Label
                    style={[
                      styles.focusHintKey,
                      {
                        backgroundColor: isDark ? darkColors.powder : colors.gray5,
                      },
                    ]}>
                    {isApple ? 'Cmd' : 'Ctrl'}
                  </Label>
                  <Label style={styles.focusHintLabel}>+</Label>
                  <Label
                    style={[
                      styles.focusHintKey,
                      {
                        backgroundColor: isDark ? darkColors.powder : colors.gray5,
                      },
                    ]}>
                    K
                  </Label>
                </View>
              ))}
          </View>
          <View
            style={[
              styles.displayHorizontal,
              styles.resultsContainer,
              isSmallScreen && styles.smallResultsContainer,
            ]}>
            {total ? (
              <P style={styles.totalText}>
                <P style={styles.totalCount}>{total}</P> {total === 1 ? 'entry' : 'entries'}
              </P>
            ) : (
              <P />
            )}
            <View style={[styles.displayHorizontal, styles.buttonsContainer]}>
              <FilterButton
                containerStyle={{ height: 24 }}
                style={{ height: 24 }}
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
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: layout.maxWidth,
    paddingHorizontal: 16,
  },
  displayHorizontal: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  textInput: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    borderRadius: 4,
    padding: 16,
    paddingLeft: 44,
    fontSize: 20,
    color: colors.white,
    fontFamily: 'inherit',
    outlineOffset: -2,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    pointerEvents: 'none',
  },
  focusHint: {
    position: 'absolute',
    right: 16,
    pointerEvents: 'none',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  focusHintKey: {
    color: colors.secondary,
    textAlign: 'center',
    paddingVertical: 3,
    paddingHorizontal: 4,
    minWidth: 24,
    borderRadius: 3,
    letterSpacing: 0.75,
  },
  focusHintLabel: {
    color: colors.gray4,
    fontWeight: 300,
  },
  resultsContainer: {
    marginTop: 8,
    justifyContent: 'space-between',
  },
  smallResultsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  buttonsContainer: {
    marginTop: 6,
  },
  totalCount: {
    color: colors.primary,
    fontWeight: 700,
  },
  totalText: {
    color: colors.white,
    marginTop: 4,
  },
});

export default Search;
