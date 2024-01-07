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
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default DirectoryWebsite;
