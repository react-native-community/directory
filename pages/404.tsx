import * as Sentry from '@sentry/react';

import ErrorScene from '~/scenes/ErrorScene';

export default function NotFound() {
  Sentry.captureMessage('404');
  return <ErrorScene statusCode={404} />;
}
