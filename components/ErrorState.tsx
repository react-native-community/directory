import { Image, StyleSheet, View } from 'react-native';

import Navigation from './Navigation';
import { H2, A, P } from '../common/styleguide';

const ErrorState = ({ statusCode }) => {
  return (
    <>
      <Navigation noHeader />
      <View style={styles.container}>
        <Image style={styles.img} source={require('../assets/notfound.png')} alt="No results" />
        <H2 style={styles.text}>Uh oh, something went wrong ({statusCode})</H2>
        <P style={[styles.text, styles.secondLine]}>
          Help fix it? Submit a PR to the{' '}
          <A href="https://github.com/react-native-directory/website">Github Repo</A>.
        </P>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 72,
    flex: 1,
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
  secondLine: {
    marginTop: 20,
  },
});

export default ErrorState;
