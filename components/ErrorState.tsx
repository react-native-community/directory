import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { H2, A } from '../common/styleguide';

export default ({ statusCode }) => {
  return (
    <View style={styles.container}>
      <H2 style={[styles.text]}>Uh oh, something went wrong ({statusCode})</H2>
      <Text style={[styles.text]}>
        Help fix it? Submit a PR to the{' '}
        <A href="https://github.com/react-native-directory/website">Github Repo</A>.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 70,
    marginBottom: 80,
  },
  img: {
    marginTop: 48,
    marginBottom: 24,
    width: 64,
    height: 64,
  },
  text: {
    textAlign: 'center',
  },
});
