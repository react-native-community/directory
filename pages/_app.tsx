import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import Head from 'next/head';
import React from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors, darkColors } from '../common/styleguide';
import Footer from '../components/Footer';
import Header from '../components/Header';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
// eslint-disable-next-line
import CustomAppearanceProvider from '../context/CustomAppearanceProvider';

import '../styles/styles.css';
import PreviewStyles from '../styles/PreviewStyles';

Sentry.init({
  dsn: 'https://d91de4406c74494dbfcadfd007774ba6@o574947.ingest.sentry.io/5727369',
  enabled: process.env.NODE_ENV === 'production',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.5 : 1.0,
});

const App = ({ pageProps, Component }) => {
  return (
    <AppearanceProvider>
      <CustomAppearanceProvider>
        <CustomAppearanceContext.Consumer>
          {context => (
            <SafeAreaProvider
              style={{
                flex: 1,
                backgroundColor: context.isDark ? darkColors.background : colors.white,
              }}>
              <Head>
                <title>React Native Directory</title>
                <meta
                  name="viewport"
                  content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover"
                />
              </Head>
              <Header />
              <Component {...pageProps} />
              <Footer />
              <PreviewStyles />
            </SafeAreaProvider>
          )}
        </CustomAppearanceContext.Consumer>
      </CustomAppearanceProvider>
    </AppearanceProvider>
  );
};

export default App;
