import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import GoogleAnalytics from './GoogleAnalytics';
import { globalStyles } from '../common/styles';
import { StyleSheet, css } from 'glamor/aphrodite';

export default class Document extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
  };

  static defaultProps = {
    title: 'Native Directory',
    description: 'Native Directory is a curated list of React Native libraries to help you build your projects.',
  };

  render() {
    return (
      <main className={css(styles.render)}>
        <Head>
          <title>{this.props.title}</title>
          <meta name="theme-color" content="#00C9FF" />
          <meta name="twitter:title" content={this.props.title} />
          <meta property="og:title" content={this.props.title} />

          <meta name="description" content={this.props.description} />
          <meta property="og:description" content={this.props.description} />
          <meta name="twitter:description" content={this.props.description} />
        </Head>
        {this.props.children}
      </main>
    );
  }
}

const styles = StyleSheet.create({
  render: {
    visibility: 'visible',
  },
});
