import * as Sentry from '@sentry/node';
import Head from 'next/head';
import React from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Footer from '../components/Footer';
import Header from '../components/Header';
import CustomAppearanceProvider from '../context/CustomAppearanceProvider';

Sentry.init({
  dsn: 'https://b084338633454a63a82c787541b96d8f@sentry.io/2503319',
  enabled: process.env.NODE_ENV === 'production',
});

const App = ({ pageProps, Component }) => {
  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <CustomAppearanceProvider>
          <Head>
            <title>React Native Directory</title>
          </Head>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </CustomAppearanceProvider>
      </AppearanceProvider>
    </SafeAreaProvider>
  );
};

export default App;
