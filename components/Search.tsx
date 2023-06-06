import Router from 'next/router';
import React, { useContext, useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

import { layout, colors, P, darkColors, useLayout } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Query } from '../types';
import urlWithQuery from '../util/urlWithQuery';
import { Filters, FilterButton } from './Filters';
import { Search as SearchIcon } from './Icons';
import { SortButton } from './Sort';

type Props = {
  query: Query;
  total: number;
};

const Search = (props: Props) => {
  const { query, total } = props;
  const [isFilterVisible, setFilterVisible] = useState(false);
  const callback = useDebouncedCallback((text: string) => {
    Router.replace(urlWithQuery('/', { ...query, search: text, offset: null }));
  }, 150);
  const { isSmallScreen } = useLayout();
  const { isDark } = useContext(CustomAppearanceContext);

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
            <TextInput
              onChangeText={callback}
              placeholder="Search libraries..."
              style={[
                styles.textInput,
                {
                  borderColor: isDark ? darkColors.border : colors.gray5,
                },
              ]}
              defaultValue={query && query.search}
              placeholderTextColor={colors.gray4}
            />
            <View style={styles.searchIcon}>
              <SearchIcon fill={colors.white} />
            </View>
          </View>
          <View
            style={[
              styles.displayHorizontal,
              styles.resultsContainer,
              isSmallScreen && styles.smallResultsContainer,
            ]}>
            {total ? (
              <P style={styles.totalText}>
                <P style={styles.totalCount}>{total}</P> {total === 1 ? 'library' : 'libraries'}
              </P>
            ) : (
              <P />
            )}
            <View style={[styles.displayHorizontal, styles.buttonsContainer]}>
              <FilterButton
                query={query}
                onPress={() => setFilterVisible(!isFilterVisible)}
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
    fontWeight: '600',
  },
  totalText: {
    color: colors.white,
    marginTop: 4,
  },
});

export default Search;
