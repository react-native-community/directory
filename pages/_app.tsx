import React from 'react';
import * as Sentry from '@sentry/node';
import Head from 'next/head';
import { View } from 'react-native';
import { AppearanceProvider } from 'react-native-appearance';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDimensions } from 'react-native-web-hooks';
import CustomAppearanceProvider from '../context/CustomAppearanceProvider';
import Favicon from '../components/Favicon';
import GoogleAnalytics from '../components/GoogleAnalytics';
import Header from '../components/Header';
import Search from '../components/Search';
import Footer from '../components/Footer';
import * as Styleguide from '../common/styleguide';

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
  let { pageProps, Component, router } = props;
  const screenWidth = useDimensions().window.width;

  return (
    <>
      <Head>
        <title>React Native Directory</title>

        <GoogleAnalytics id="UA-107832480-1" />

        {injectMeta.map((value, index) => {
          return <meta key={`meta-${index}`} {...value} />;
        })}
      </Head>
      <SafeAreaProvider>
        <AppearanceProvider>
          <CustomAppearanceProvider>
            <>
              <Favicon />
              <Header />
              <Search query={router.query} total={pageProps.data && pageProps.data.total} />
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  maxWidth: Styleguide.layout.maxWidth,
                  margin: 'auto',
                }}>
                <Component {...pageProps} />
                <Footer />
                <style jsx global>{`
                  .preview {
                    background-color: white !important;
                    opacity: 1 !important;
                    padding: 10px !important;
                    box-shadow: 0 5px 5px 0px #00000025 !important;
                  }

                  .preview img {
                    max-width: ${screenWidth < 640 ? screenWidth - 20 : 640}px;
                    max-height: 320px;
                  }

                  .thumbnail-link {
                    cursor: pointer !important;
                    margin-right: 6px !important;
                  }

                  .thumbnail-link:hover path {
                    fill: ${Styleguide.colors.primary} !important;
                  }
                `}</style>
              </View>
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
