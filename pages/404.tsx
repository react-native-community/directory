import { captureMessage } from '@sentry/react';

import ErrorScene from '~/scenes/ErrorScene';

export default function NotFound() {
  captureMessage('404');
  return <ErrorScene statusCode={404} />;
}
