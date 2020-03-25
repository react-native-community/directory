import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';
import Router from 'next/router';
import urlWithQuery from '../util/urlWithQuery';
import { layout, colors, P } from '../common/styleguide';
import { Search as SearchIcon } from './Icons';
import { Filters, FilterButton } from './Filters';
import { SortButton } from './Sort';

type Props = {
  query: {
    [key: string]: any;
  };
  total: number;
};

export default function Search(props: Props) {
  const { query, total } = props;
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [debouncedCallback] = useDebouncedCallback(text => {
    Router.replace(urlWithQuery('/', { ...query, search: text, offset: null }));
  }, 150);

  return (
    <View>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.displayHorizontal}>
            <TextInput
              onChangeText={debouncedCallback}
              placeholder="Search libraries..."
              style={styles.textInput}
              defaultValue={query && query.search}
            />
            <View style={styles.searchIcon}>
              <SearchIcon fill={colors.white} />
            </View>
          </View>
          <View style={[styles.displayHorizontal, styles.resultsContainer]}>
            <P style={{ color: colors.white }}>
              {total} {total === 1 ? 'library' : 'libraries'}
            </P>
            <View style={styles.displayHorizontal}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 16,
    backgroundColor: colors.gray6,
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
    borderColor: colors.gray5,
    borderRadius: 4,
    padding: 16,
    paddingLeft: 44,
    outlineColor: colors.primary,
    fontSize: 20,
    color: colors.white,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
  },
  resultsContainer: {
    marginTop: 8,
    justifyContent: 'space-between',
  },
});
