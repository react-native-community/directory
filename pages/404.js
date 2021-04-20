import * as Sentry from '@sentry/react';
import React from 'react';

import ErrorState from '../components/ErrorState';

export default function NotFound() {
  Sentry.captureMessage('404');
  return <ErrorState statusCode={404} />;
}
