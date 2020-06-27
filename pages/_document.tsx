import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

import GoogleAnalytics from '../components/GoogleAnalytics';
import PreviewStyles from '../styles/PreviewStyles';

const site = {
  title: 'React Native Directory',
  description: 'A directory to find packages for your React Native apps',
};

const themeColor = '#fff';

class DirectoryWebsite extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <GoogleAnalytics id="UA-107832480-1" />
          {injectMeta.map((value, index) => (
            <meta key={`meta-${index}`} {...value} />
          ))}
        </Head>
        <body>
          <PreviewStyles />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

const injectMeta = [
  {
    name: 'description',
    content: site.description,
  },
  {
    property: 'og:description',
    content: site.description,
  },
  {
    property: 'og:title',
    content: site.title,
  },
  {
    property: 'og:site_name',
    content: site.title,
  },
  {
    property: 'og:url',
    content: 'https://reactnative.directory',
  },
  {
    property: 'og:type',
    content: 'website',
  },
  {
    key: 'viewport',
    name: 'viewport',
    content:
      'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover',
  },
  {
    name: 'msapplication-TileColor',
    content: themeColor,
  },
  {
    name: 'theme-color',
    content: themeColor,
  },
  { name: 'twitter:card', content: 'Find packages for your apps' },
  { name: 'twitter:title', content: site.title },
  { name: 'twitter:description', content: site.description },

  // Image
  // { property: 'og:image', content: image.url },
  // { property: 'og:image:secure_url', content: image.secureUrl },
  // { property: 'og:image:type', content: image.type },
  // { property: 'og:image:width', content: image.width },
  // { property: 'og:image:height', content: image.height },
  // { property: 'og:image:alt', content: image.description },
];

export default DirectoryWebsite;
