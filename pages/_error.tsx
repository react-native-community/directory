// This code is based on the default Sentry error page provided by https://github.com/vercel/next.js/blob/canary/examples/with-sentry/pages/_error.tsx
// It has been altered to use `@sentry/react` and to handle https://github.com/vercel/next.js/issues/8592

import * as Sentry from '@sentry/react';
import { type NextPageContext } from 'next';
import Error, { type ErrorProps } from 'next/error';

import ErrorScene from '~/scenes/ErrorScene';

type ExtendedErrorProps = ErrorProps & {
  hasGetInitialPropsRun?: boolean;
  err?: NextPageContext['err'];
};

function ErrorPage({ statusCode, hasGetInitialPropsRun, err }: ExtendedErrorProps) {
  if (!hasGetInitialPropsRun && err) {
    Sentry.captureException(err);
  }

  return <ErrorScene statusCode={statusCode} />;
}

ErrorPage.getInitialProps = async (nextPageContext: NextPageContext) => {
  const errorInitialProps: ExtendedErrorProps = await Error.getInitialProps(nextPageContext);

  errorInitialProps.hasGetInitialPropsRun = true;

  if (nextPageContext.err) {
    Sentry.captureException(nextPageContext.err);
    return errorInitialProps;
  }

  return errorInitialProps;
};

export default ErrorPage;
