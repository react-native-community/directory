import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import GoogleAnalytics from './GoogleAnalytics';
import { globalStyles } from '../common/styles';

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
      <div>
        <Head>
          <title>{this.props.title}</title>
          <meta name="theme-color" content="#00C9FF" />
          <meta name="twitter:title" content={this.props.title} />
          <meta property="og:title" content={this.props.title} />

          <meta name="description" content={this.props.description} />
          <meta property="og:description" content={this.props.description} />
          <meta name="twitter:description" content={this.props.description} />

          <meta name="format-detection" content="telephone=no" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="UTF-8" />
          <meta name="sourceApp" content="mobileWeb" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta property="og:site_name" content="React Native Directory" />
          <meta name="twitter:site" content="@expo_io" />

          <link rel="shortcut icon" href="/static/favicon.png" />

          <link rel="apple-touch-icon-precomposed" content="/static/logo.png" />
          <meta property="og:image" content="/static/logo.png" />
          <meta name="twitter:image" content="/static/logo.png" />
          <meta name="msapplication-TileImage" content="/static/logo.png" />
          <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
          <GoogleAnalytics id="UA-107832480-1" />
        </Head>
        {this.props.children}
      </div>
    );
  }
}
