import * as React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';
import Router from 'next/router';
import urlWithQuery from '../util/urlWithQuery';
import { layout, colors } from '../common/styleguide';
import { Search } from './Icons/Search';

export default function GlobalSearch({ query }) {
  const [debouncedCallback] = useDebouncedCallback(text => {
    Router.replace(urlWithQuery('/', { ...query, search: text, offset: null }));
  }, 150);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TextInput
          onChangeText={debouncedCallback}
          placeholder="Search"
          style={styles.textInput}
          defaultValue={query && query.search}
        />
        <View style={styles.searchIcon}>
          <Search fill={colors.white} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 24,
    backgroundColor: colors.gray6,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    maxWidth: layout.maxWidth,
    paddingHorizontal: 16,
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
    left: 32,
  },
});
