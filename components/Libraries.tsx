import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { H3, A } from '../common/styleguide';
import { Library as LibraryType } from '../types';
import Library from './Library';
import Tooltip from './Tooltip';

type Props = {
  libraries: LibraryType[];
};

export default function Libraries(props: Props) {
  const { libraries } = props;

  if (!libraries || !libraries.length) {
    return (
      <View style={styles.container}>
        <Image style={styles.img} source={require('../assets/notfound.png')} />
        <H3 style={styles.text}>Nothing was found! Try another search.</H3>
        <View style={{ marginTop: 20 }} />
        <Text style={styles.text}>
          Want to contribute a library you like? Submit a PR to the{' '}
          <A href="https://github.com/react-native-community/react-native-directory">Github Repo</A>
          .
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.librariesContainer}>
        {libraries.map((item: any, index: number) => (
          <Library key={`list-item-${index}-${item.github.name}`} library={item} />
        ))}
      </View>
      <Tooltip />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 40,
    marginBottom: 80,
  },
  librariesContainer: {
    paddingTop: 8,
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
