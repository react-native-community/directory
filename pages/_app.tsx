import '~/styles/styles.css';

import * as Sentry from '@sentry/react';
import { type AppProps } from 'next/app';
import Head from 'next/head';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Footer from '~/components/Footer';
import CustomAppearanceProvider from '~/context/CustomAppearanceProvider';
import tw from '~/util/tailwind';

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
      <SafeAreaProvider>
        <Head>
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=2,viewport-fit=cover"
          />
        </Head>
        <main style={tw`flex flex-col flex-1`}>
          <Component {...pageProps} />
        </main>
        <Footer />
      </SafeAreaProvider>
    </CustomAppearanceProvider>
  );
}

export default Sentry.withProfiler(App);
