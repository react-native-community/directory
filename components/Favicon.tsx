import Head from 'next/head';
import * as React from 'react';

export default function() {
  return (
    <Head>
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={require('../assets/favicon-32x32.png')}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={require('../assets/favicon-16x16.png')}
      />
    </Head>
  );
}
