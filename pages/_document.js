import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { renderStatic } from 'glamor/server';
import GoogleAnalytics from '../components/GoogleAnalytics';
import { globalStyles } from '../common/styles';

export default class WebDocument extends Document {
  static async getInitialProps({ renderPage }) {
    const page = renderPage();
    const styles = renderStatic(() => page.html);
    return { ...page, ...styles };
  }

  constructor(props) {
    super(props);
    const { __NEXT_DATA__, ids } = props;
    if (ids) {
      __NEXT_DATA__.ids = this.props.ids;
    }
  }

  render() {
    return (
      <html>
        <Head>
          <meta name="format-detection" content="telephone=no" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="UTF-8" />
          <meta name="sourceApp" content="mobileWeb" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta property="og:site_name" content="React React Native Directory" />
          <meta name="twitter:site" content="@expo_io" />

          <link rel="shortcut icon" href="/static/favicon.png" />

          <link rel="apple-touch-icon-precomposed" content="/static/logo.png" />
          <meta property="og:image" content="/static/logo.png" />
          <meta name="twitter:image" content="/static/logo.png" />
          <meta name="msapplication-TileImage" content="/static/logo.png" />
          <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
          <GoogleAnalytics id="UA-107832480-1" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
