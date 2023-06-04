import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import Head from 'next/head';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors, darkColors } from '../common/styleguide';
import Footer from '../components/Footer';
import Header from '../components/Header';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
// eslint-disable-next-line
import CustomAppearanceProvider from '../context/CustomAppearanceProvider';

import '../styles/styles.css';

Sentry.init({
  dsn: 'https://d91de4406c74494dbfcadfd007774ba6@o574947.ingest.sentry.io/5727369',
  enabled: process.env.NODE_ENV === 'production',
  allowUrls: process.env.NODE_ENV === 'production' ? [/https:\/\/reactnative\.directory/] : [],
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.5 : 1.0,
});

const App = ({ pageProps, Component }) => (
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
            <style>
              {`html { 
                  font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                  background-color: ${context.isDark ? darkColors.veryDark : colors.gray7};
                }
                *:focus-visible {
                  outline-color: ${colors.primaryDark};
                  outline-style: solid;
                  outline-width: 2px;
                }`}
            </style>
          </Head>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </SafeAreaProvider>
      )}
    </CustomAppearanceContext.Consumer>
  </CustomAppearanceProvider>
);

export default Sentry.withProfiler(App);
