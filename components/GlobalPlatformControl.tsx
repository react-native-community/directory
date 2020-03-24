import * as React from 'react';
import { StyleSheet, Text, View, CheckBox } from 'react-native';
import Link from 'next/link';
import { A } from '@expo/html-elements';
import urlWithQuery from '../util/urlWithQuery';
import { colors } from '../common/styleguide';

function ToggleLink({ query, paramName, title }) {
  let isSelected = !!query[paramName];

  return (
    <Link
      href={urlWithQuery('/', {
        ...query,
        [paramName]: !isSelected,
        offset: null,
      })}>
      <View style={styles.link}>
        <CheckBox
          value={isSelected}
          {...{
            color: colors.primaryDark,
            style: { marginRight: 6 },
          }}
        />
        <Text>{title}</Text>
      </View>
    </Link>
  );
}

export default function GlobalPlatformControl({ query }: { query: { [key: string]: any } }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Platform</Text>
      <ToggleLink query={query} paramName="ios" title="iOS" />
      <ToggleLink query={query} paramName="android" title="Android" />
      <ToggleLink query={query} paramName="web" title="Web" />
      <ToggleLink query={query} paramName="expo" title="Expo client" />
    </View>
  );
}

let styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  link: {
    fontSize: 14,
    marginBottom: 12,
    alignItems: 'center',
    flexDirection: 'row',
    cursor: 'pointer',
  },
});
