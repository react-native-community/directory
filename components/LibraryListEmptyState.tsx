import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import ExternalLink from './ExternalLink';

export default () => {
  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require('../assets/notfound.png')} />
      <Text style={styles.text}>Nothing was found! Try another search.</Text>
      <View style={{marginTop: 20}} />
      <Text style={styles.text}>
        Want to contribute a library you like? Submit a PR to the{' '}
        <ExternalLink href="https://github.com/react-native-community/react-native-directory">
          Github Repo.
        </ExternalLink>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 40,
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
  }
});
