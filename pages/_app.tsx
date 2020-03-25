import * as React from 'react';
import * as Sentry from '@sentry/node';
import Head from 'next/head';
import { View } from 'react-native';
import { AppearanceProvider } from 'react-native-appearance';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { H3 } from '@expo/html-elements';
import CustomAppearanceProvider from '../context/CustomAppearanceProvider';
import Favicon from '../components/Favicon';
import GoogleAnalytics from '../components/GoogleAnalytics';
import GlobalHeader from '../components/GlobalHeader';
import GlobalOrderControl from '../components/GlobalOrderControl';
import GlobalPlatformControl from '../components/GlobalPlatformControl';
import GlobalSearch from '../components/GlobalSearch';
import GlobalFooter from '../components/GlobalFooter';
import { layout, colors } from '../common/styleguide';
// import data from '../assets/data.json';

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
              <GlobalHeader />
              <GlobalSearch query={router.query} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: colors.gray1,
                }}>
                <View>
                  {router.query.search ? (
                    <H3>
                      {pageProps.data.total} result{pageProps.data.total === 1 ? '' : 's'} for "
                      {router.query.search}"
                    </H3>
                  ) : null}
                </View>
                <View>
                  <select>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  width: '100%',
                  maxWidth: layout.maxWidth,
                  margin: 'auto',
                }}>
                <View style={{ borderWidth: 1 }}>
                  <Component {...pageProps} />
                </View>
                <GlobalFooter />
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
    name: `description`,
    content: site.description,
  },
  {
    property: `og:description`,
    content: site.description,
  },
  {
    property: `og:title`,
    content: site.title,
  },
  {
    property: 'og:site_name',
    content: site.title,
  },
  {
    property: 'og:url',
    content: `https://reactnative.directory`,
  },
  {
    property: `og:type`,
    content: `website`,
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
  { name: `twitter:card`, content: 'Find packages for your apps' },
  { name: `twitter:title`, content: site.title },
  { name: `twitter:description`, content: site.description },

  // Image
  // { property: 'og:image', content: image.url },
  // { property: 'og:image:secure_url', content: image.secureUrl },
  // { property: 'og:image:type', content: image.type },
  // { property: 'og:image:width', content: image.width },
  // { property: 'og:image:height', content: image.height },
  // { property: 'og:image:alt', content: image.description },
];
