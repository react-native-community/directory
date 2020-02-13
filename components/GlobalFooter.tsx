import React from 'react';
import ExternalLink from '../components/ExternalLink';
import { Text, StyleSheet, View } from 'react-native';

export default () => {
  return (
    <View style={styles.container}>
      <Text style={{ lineHeight: 22 }}>
        Missing a library?{' '}
        <ExternalLink href="https://github.com/react-native-community/react-native-directory#how-do-i-add-a-library">
          Add it to the directory
        </ExternalLink>
        . Want to learn more about React Native? Check out the{' '}
        <ExternalLink href="https://facebook.github.io/react-native/docs/getting-started.html">
          official React Native docs
        </ExternalLink>
        , and <ExternalLink href="https://expo.io">Expo</ExternalLink>.
      </Text>
    </View>
  );
};

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
