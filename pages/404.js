import React from 'react';
import * as Sentry from '@sentry/react';
import { useRouter } from 'next/router';

import ErrorState from '../components/ErrorState';

export default function NotFound() {
  const router = useRouter();
  Sentry.captureException('CE404: ' + router.pathname);
  Sentry.captureMessage('CM404: ' + router.pathname);
  return <ErrorState statusCode={404} />;
}
