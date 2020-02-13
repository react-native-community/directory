import * as React from 'react';
import { TextInput, Text, StyleSheet, View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';
import Router from 'next/router';
import urlWithQuery from '../util/urlWithQuery';

export default function GlobalSearch({ query }) {
  const [debouncedCallback] = useDebouncedCallback(text => {
    Router.replace(urlWithQuery('/', { ...query, search: text, offset: null }));
  }, 150);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search:</Text>
      <TextInput
        onChangeText={debouncedCallback}
        placeholder="Type here..."
        style={styles.textInput}
        defaultValue={query && query.search}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 20,
    marginTop: 20,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'office-code-medium',
    fontSize: 13,
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    height: 25,
    fontFamily: 'office-code',
    paddingLeft: 5,
    color: 'rgb(65, 160, 248)',
    marginTop: -1,
  },
});
