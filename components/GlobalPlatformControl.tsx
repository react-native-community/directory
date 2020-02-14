import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Link from 'next/link';
import { A } from '@expo/html-elements';
import urlWithQuery from '../util/urlWithQuery';

function ToggleLink({ query, paramName, title }) {
  let isSelected = !!query[paramName];

  return (
    <Link
      href={urlWithQuery('/', {
        ...query,
        [paramName]: !isSelected,
        offset: null,
      })}>
      <A style={[styles.link]}>
        {isSelected ? '✅' : '🤷‍♀️'}
        {title}
      </A>
    </Link>
  );
}

export default function GlobalPlatformControl({ query }: { query: { [key: string]: any } }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compatibility:</Text>

      <ToggleLink query={query} paramName="ios" title="iOS" />
      <ToggleLink query={query} paramName="android" title="Android" />
      <ToggleLink query={query} paramName="web" title="Web" />
      <ToggleLink query={query} paramName="windows" title="Windows" />
      <ToggleLink query={query} paramName="macos" title="macOS" />
      <ToggleLink query={query} paramName="expo" title="Expo client" />
    </View>
  );
}

let styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'office-code-medium',
    fontSize: 13,
    marginRight: 10,
    marginBottom: 10,
  },
  link: {
    fontFamily: 'office-code',
    fontSize: 13,
    marginRight: 20,
    marginBottom: 10,
  },
  linkActive: {
    color: 'rgba(65, 160, 248, 1)',
  },
});
