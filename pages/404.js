import React from 'react';

import ErrorState from '../components/ErrorState';

export default function NotFound() {
  // Opinionated: do not record an exception in Sentry for 404
  return <ErrorState statusCode={404} />;
}
