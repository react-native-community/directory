import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';

import GoogleAnalytics from '~/components/GoogleAnalytics';
import { StructuredData } from '~/components/StructuredData';

class DirectoryWebsite extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render = () => (
    <Html lang="en">
      <Head>
        <GoogleAnalytics id="G-T0F1XSEWES" />

        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#20232a" />

        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
        <link rel="icon" href="/favicon.png?v=2" type="image/png" />
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" sizes="any" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" type="image/png" href="/icon-180px.png" />
        <meta name="msapplication-TileColor" content="#20232a" />

        <meta name="application-name" content="React Native Directory" />
        <meta property="og:site_name" content="React Native Directory" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://reactnative.directory" />

        <StructuredData
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'React Native Directory',
            url: 'https://reactnative.directory/',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://reactnative.directory/?search={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default DirectoryWebsite;
