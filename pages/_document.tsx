import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';

import GoogleAnalytics from '../components/GoogleAnalytics';

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

        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          type="image/png"
          href="/apple-touch-icon.png"
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
