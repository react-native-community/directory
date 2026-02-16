import dynamic from 'next/dynamic';
import { Image, StyleSheet, View } from 'react-native';

import { H3, A, P } from '~/common/styleguide';
import LoadingContent from '~/components/Library/LoadingContent';
import { Library as LibraryType } from '~/types';

type Props = {
  libraries: LibraryType[];
};

const LibraryWithLoading = dynamic(() => import('~/components/Library'), {
  loading: () => <LoadingContent />,
});

const Libraries = ({ libraries }: Props) => {
  if (!libraries || !libraries.length) {
    return (
      <View style={styles.container}>
        <Image style={styles.img} source={require('~/assets/notfound.png')} alt="No results" />
        <H3 style={styles.text}>Nothing was found! Try another search.</H3>
        <View style={{ marginTop: 20 }} />
        <P style={styles.text}>
          Want to contribute a library you like? Submit a PR to the{' '}
          <A href="https://github.com/react-native-community/react-native-directory">GitHub Repo</A>
          .
        </P>
      </View>
    );
  }

  return (
    <View style={styles.librariesContainer}>
      {libraries.map((item: any, index: number) => (
        <LibraryWithLoading key={`list-item-${index}-${item.github.name}`} library={item} />
      ))}
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
  librariesContainer: {
    paddingTop: 12,
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

export default Libraries;
