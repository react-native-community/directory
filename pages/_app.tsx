import * as Sentry from '@sentry/react';
import Head from 'next/head';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors, darkColors } from '~/common/styleguide';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import CustomAppearanceProvider from '~/context/CustomAppearanceProvider';

import '~/styles/styles.css';

const isProd = process.env.NODE_ENV === 'production';

Sentry.init({
  enabled: isProd,
  dsn: 'https://d91de4406c74494dbfcadfd007774ba6@o574947.ingest.sentry.io/5727369',
  environment: isProd ? 'production' : 'development',
  allowUrls: isProd ? [/https:\/\/reactnative\.directory/] : [],
  integrations: isProd ? [Sentry.browserTracingIntegration()] : [],
  tracesSampleRate: isProd ? 0.5 : 1.0,
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
            <meta
              name="viewport"
              content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=2,viewport-fit=cover"
            />
            <style>
              {`html { 
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
