// This code is based on the default Sentry error page provided by https://github.com/vercel/next.js/blob/canary/examples/with-sentry/pages/_error.tsx
// It has been altered to use `@sentry/react` and to handle https://github.com/vercel/next.js/issues/8592

import * as Sentry from '@sentry/react';
import { type NextPageContext } from 'next';
import Error, { type ErrorProps } from 'next/error';

import ErrorState from '~/components/ErrorState';

type ExtendedErrorProps = ErrorProps & {
  hasGetInitialPropsRun?: boolean;
};

function MyError({ statusCode, hasGetInitialPropsRun, err }) {
  if (!hasGetInitialPropsRun && err) {
    Sentry.captureException(err);
  }

  return <ErrorState statusCode={statusCode} />;
}

MyError.getInitialProps = async (nextPageContext: NextPageContext) => {
  const errorInitialProps: ExtendedErrorProps = await Error.getInitialProps(nextPageContext);

  errorInitialProps.hasGetInitialPropsRun = true;

  if (nextPageContext.err) {
    Sentry.captureException(nextPageContext.err);
    return errorInitialProps;
  }

  return errorInitialProps;
};

export default MyError;
