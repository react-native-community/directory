import * as Sentry from '@sentry/react';
import { type AppProps } from 'next/app';
import Head from 'next/head';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors, darkColors } from '~/common/styleguide';
import Footer from '~/components/Footer';
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

function App({ pageProps, Component }: AppProps) {
  return (
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
                {context.isDark
                  ? `
                  :root {
                    --outline: ${colors.primaryDark};
                    --active: ${darkColors.primaryDark};
                    --select-background: ${darkColors.dark};
                    --select-border: ${colors.gray6};
                    --tooltip-border: ${colors.gray7};
                  }
                `
                  : `
                  :root {
                    --outline: ${colors.primaryDark};
                    --active: ${darkColors.primaryDark};
                    --select-background: ${colors.gray6};
                    --select-border: ${colors.gray5};
                    --tooltip-border: ${colors.gray6};
                  }
                `}
              </style>
            </Head>
            <Component {...pageProps} />
            <Footer />
          </SafeAreaProvider>
        )}
      </CustomAppearanceContext.Consumer>
    </CustomAppearanceProvider>
  );
}

export default Sentry.withProfiler(App);
