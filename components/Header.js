import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, css } from 'glamor/aphrodite';

import Link from '../components/Link';

export default class Header extends React.PureComponent {
  static propTypes = {
    count: PropTypes.number,
  };

  render() {
    return (
      <header className={css(styles.header)}>
        <div className={css(styles.headerContents)}>
          <a className={css(styles.headerContentsLogo)} href="/">
            <img src="/static/logo.png" alt="Native Directory logo" width="64" height="64" />
          </a>
          <div className={css(styles.headerContentsText)}>
            <p>
              <strong className={css(styles.headerContentsTextStrong)}>Native Directory</strong> is
              a curated list of {this.props.count}{' '}
              <Link
                isStyled
                href="https://facebook.github.io/react-native/docs/getting-started.html">
                React Native
              </Link>{' '}
              libraries to help you build your projects.
            </p>
          </div>
        </div>
      </header>
    );
  }
}

let styles = StyleSheet.create({
  header: {
    width: '100%',
    maxWidth: '1319px',
    padding: '0 24px 0 24px',
    boxSizing: 'border-box',
    margin: '2rem auto 0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '@media (max-width: 600px)': {
      margin: '2rem auto 0 auto',
    },
  },
  headerContents: {
    maxWidth: '420px',
    width: '100%',
    padding: '0 24px 0 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContentsLogo: {
    flexShrink: 0,
    padding: '0 8px 0 0',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  headerContentsText: {
    minWidth: '25%',
    width: '100%',
  },
  headerContentsTextStrong: {
    fontWeight: 700,
  },
});
