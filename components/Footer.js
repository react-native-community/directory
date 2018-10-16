import React from 'react';
import Link from '../components/Link';

import { StyleSheet, css } from 'glamor/aphrodite';

export default () => {
  return (
    <footer className={css(styles.footer)}>
      <div className={css(styles.container)}>
        <p className={css(styles.text)}>
          Missing a library?{' '}
          <Link
            isStyled
            href="https://github.com/react-community/native-directory#how-do-i-add-a-library">
            Add it to the directory
          </Link>. Want to learn more about React Native? Check out the{' '}
          <Link isStyled href="https://facebook.github.io/react-native/docs/getting-started.html">
            official docs
          </Link>, and{' '}
          <Link isStyled href="https://expo.io">
            Expo
          </Link>.
        </p>
      </div>
    </footer>
  );
};

let styles = StyleSheet.create({
  footer: {
    borderTop: '1px solid #ECECEC',
    width: '100%',
  },
  container: {
    width: '100%',
    maxWidth: '1319px',
    padding: '24px 24px 24px 24px',
    margin: '0 auto 0 auto',
  },
});
