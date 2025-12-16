import { Image, StyleSheet, View } from 'react-native';

import { H2, A, P } from '~/common/styleguide';
import Navigation from '~/components/Navigation';
import NotFound from '~/components/Package/NotFound';
import PageMeta from '~/components/PageMeta';

type Props = {
  statusCode: number;
  reason?: string;
};

export default function ErrorScene({ statusCode, reason }: Props) {
  if (statusCode === 404) {
    return <NotFound />;
  }

  return (
    <>
      <PageMeta title="Error" description="Uh oh, something went wrong" />
      <Navigation header={<></>} />
      <View style={styles.container}>
        <Image style={styles.img} source={require('~/assets/notfound.png')} alt="No results" />
        <H2 style={styles.text}>Uh oh, something went wrong ({statusCode})</H2>
        <P style={[styles.text, styles.secondLine]}>
          {reason ?? (
            <>
              Help fix it? Submit a PR to the{' '}
              <A href="https://github.com/react-native-community/directory">GitHub repository</A>.
            </>
          )}
        </P>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 72,
    flex: 1,
  },
  img: {
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
