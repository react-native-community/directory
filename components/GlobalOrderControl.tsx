import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Link from 'next/link';
import { A } from '@expo/html-elements';
import urlWithQuery from '../util/urlWithQuery';

export default function GlobalOrderControl({ query }: { query: { [key: string]: any } }) {
  const { order } = query;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order By</Text>

      <Link href={urlWithQuery('/', { ...query, order: null, offset: null })}>
        <A style={[styles.link, !order && styles.linkActive]}>Last Updated</A>
      </Link>

      <Link href={urlWithQuery('/', { ...query, order: 'recommended', offset: null })}>
        <A style={[styles.link, order === 'recommended' && styles.linkActive]}>Recommended</A>
      </Link>

      <Link href={urlWithQuery('/', { ...query, order: 'quality', offset: null })}>
        <A style={[styles.link, order === 'quality' && styles.linkActive]}>Quality</A>
      </Link>

      <Link href={urlWithQuery('/', { ...query, order: 'issues', offset: null })}>
        <A style={[styles.link, order === 'issues' && styles.linkActive]}>Issues</A>
      </Link>

      <Link href={urlWithQuery('/', { ...query, order: 'downloads', offset: null })}>
        <A style={[styles.link, order === 'downloads' && styles.linkActive]}>Downloads</A>
      </Link>

      <Link href={urlWithQuery('/', { ...query, order: 'stars', offset: null })}>
        <A style={[styles.link, order === 'stars' && styles.linkActive]}>Stars</A>
      </Link>
    </View>
  );
}

let styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  link: {
    fontSize: 14,
    marginRight: 20,
    marginBottom: 10,
  },
  linkActive: {
    color: 'rgba(65, 160, 248, 1)',
  },
});
