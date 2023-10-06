import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';

import Favicons from '../components/Favicons';
import GoogleAnalytics from '../components/GoogleAnalytics';

class DirectoryWebsite extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render = () => (
    <Html lang="en">
      <Head>
        <Favicons />
        <GoogleAnalytics id="UA-107832480-1" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default DirectoryWebsite;
