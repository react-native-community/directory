import Head from 'next/head';
import React from 'react';

const site = {
  title: 'React Native Directory',
  description: 'An interactive directory to find packages for your React Native apps.',
};

const PageMeta = ({ title, description = site.description }) => {
  const pageTitle = `${title ? title + ' • ' : ''}${site.title}`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={site.title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://reactnative.directory/" />
      <meta property="og:image" content="https://reactnative.directory/logo-og.png" />

      <meta name="twitter:card" content="summary_large_image" />

      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#14141a" />

      <meta name="application-name" content={site.title} />
      <meta name="msapplication-TileColor" content="#14141a" />
    </Head>
  );
};

export default PageMeta;
