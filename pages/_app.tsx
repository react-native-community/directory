import * as Sentry from '@sentry/node';
import Head from 'next/head';
import React from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Favicon from '../components/Favicon';
import Footer from '../components/Footer';
import GoogleAnalytics from '../components/GoogleAnalytics';
import Header from '../components/Header';
import CustomAppearanceProvider from '../context/CustomAppearanceProvider';
import PreviewStyles from '../styles/PreviewStyles';

Sentry.init({
  dsn: 'https://b084338633454a63a82c787541b96d8f@sentry.io/2503319',
  enabled: process.env.NODE_ENV === 'production',
});

const site = {
  title: 'React Native Directory',
  description: 'A directory to find packages for your React Native apps',
};

const themeColor = '#fff';

export default function App(props: any) {
  let { pageProps, Component } = props;
  return (
    <>
      <Head>
        <title>React Native Directory</title>

        <GoogleAnalytics id="UA-107832480-1" />

        {injectMeta.map((value, index) => {
          return <meta key={`meta-${index}`} {...value} />;
        })}
      </Head>
      <PreviewStyles />
      <SafeAreaProvider>
        <AppearanceProvider>
          <CustomAppearanceProvider>
            <>
              <Favicon />
              <Header />
              <Component {...pageProps} />
              <Footer />
            </>
          </CustomAppearanceProvider>
        </AppearanceProvider>
      </SafeAreaProvider>
    </>
  );
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
