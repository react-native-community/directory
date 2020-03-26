import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import range from 'lodash/range';
import Link from 'next/link';
import { A } from '@expo/html-elements';
import { Query } from '../types';
import urlWithQuery from '../util/urlWithQuery';
import { NUM_PER_PAGE } from '../util/Constants';

export default function PaginationControl({
  query,
  total,
  style,
}: {
  query: Query;
  total: number | null;
  style?: any;
}) {
  let numPages = Math.ceil(total / NUM_PER_PAGE);
  let currentOffset = parseInt(query.offset ? query.offset : 0, 10);

  let links = range(0, numPages).map(page => {
    let offset = page * NUM_PER_PAGE;

    return (
      <Link href={urlWithQuery('/', { ...query, offset })} key={offset.toString()}>
        <A style={[styles.link, currentOffset === offset && styles.linkActive]}>
          {offset + 1}-{numPages === 1 ? total : (page + 1) * NUM_PER_PAGE}
        </A>
      </Link>
    );
  });

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Results:</Text>
      {links.length ? links : <Text>-</Text>}
    </View>
  );
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 20,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 13,
    marginRight: 10,
    marginBottom: 10,
  },
  link: {
    fontSize: 13,
    marginRight: 20,
    marginBottom: 10,
  },
  linkActive: {
    color: 'rgba(65, 160, 248, 1)',
  },
});
