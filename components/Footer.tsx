import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { A } from '../common/styleguide';

export default function Footer() {
  return (
    <View style={styles.container}>
      <Text style={{ lineHeight: 22 }}>
        Missing a library?{' '}
        <A href="https://github.com/react-native-community/react-native-directory#how-do-i-add-a-library">
          Add it to the directory
        </A>
        . Want to learn more about React Native? Check out the{' '}
        <A href="https://facebook.github.io/react-native/docs/getting-started.html">
          official React Native docs
        </A>
        , and <A href="https://expo.io">Expo</A>.
      </Text>
    </View>
  );
}

let styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 24,
    paddingLeft: 20,
    marginBottom: 10,
    borderTopWidth: 1,
    marginTop: 10,
    borderTopColor: '#ececec',
  },
});
