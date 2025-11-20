import { type ReactElement } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { A, H3, P } from '~/common/styleguide';

type Props = {
  header?: string;
  alt?: string;
  bottomSlot?: ReactElement;
};

export default function NotFoundContent({
  header = 'Nothing was found! Try another search.',
  alt = 'No results',
  bottomSlot,
}: Props) {
  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require('~/assets/notfound.png')} alt={alt} />
      <H3 style={styles.text}>{header}</H3>
      <View style={styles.separator} />
      <P style={styles.text}>
        Want to contribute a library you like? Submit a PR to the{' '}
        <A href="https://github.com/react-native-community/react-native-directory">GitHub Repo</A>.
      </P>
      {bottomSlot}
    </View>
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
  img: {
    marginTop: 48,
    marginBottom: 24,
    width: 64,
    height: 64,
  },
  text: {
    textAlign: 'center',
  },
  separator: {
    marginTop: 20,
  },
});
