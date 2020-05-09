import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Router, { useRouter } from 'next/router';
import { useDebouncedCallback } from 'use-debounce';
import { Library } from '../types';
import { colors, Label } from '../common/styleguide';
import urlWithQuery from '../util/urlWithQuery';

type Props = {
  library: Library;
};

export function Topics(props: Props) {
  const { library } = props;
  const { topics } = library.github;
  const router = useRouter();
  const [debouncedCallback] = useDebouncedCallback(text => {
    Router.replace(urlWithQuery('/', { ...router.query, search: text, offset: null }));
  }, 150);
  return (
    <View style={styles.container}>
      {topics.map(topic => (
        <TouchableOpacity key={topic} style={styles.tag} onPress={() => debouncedCallback(topic)}>
          <Label style={styles.text}>{topic}</Label>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: -4,
  },
  tag: {
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    marginRight: 8,
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginBottom: 4,
    cursor: 'pointer',
  },
  text: {
    color: colors.white,
  },
});
