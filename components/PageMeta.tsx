import getShareImage from '@jlengstorf/get-share-image';
import Head from 'next/head';
import React from 'react';

const site = {
  title: 'React Native Directory',
  description: 'An interactive directory to find packages for your React Native apps.',
};

type PageMetaProps = {
  title?: string;
  description?: string;
  query?: string | string[];
};

const PageMeta = ({ title, query, description = site.description }: PageMetaProps) => {
  const pageTitle = `${title ? title + ' • ' : ''}${site.title}`;
  const parsedQuery = Array.isArray(query) ? query[0] : query;
  const searchDescription = `Search results for keyword:\n"${parsedQuery}"`;

  const socialImage = getShareImage({
    title: site.title,
    tagline: parsedQuery ? searchDescription : description,
    cloudName: 'react-native-directory',
    imagePublicID: 'share-bg',
    titleColor: 'fff',
    titleFont: 'futura',
    taglineFont: 'futura',
    taglineColor: 'aeb1bc',
    titleBottomOffset: 372,
    taglineTopOffset: 324,
  });

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={parsedQuery ? searchDescription : description} />
      <meta property="og:site_name" content={site.title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://reactnative.directory" />
      <meta property="og:image" content={socialImage} />

      <meta name="twitter:card" content="summary_large_image" />

      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#14141a" />

      <meta name="application-name" content={site.title} />
      <meta name="msapplication-TileColor" content="#14141a" />
    </Head>
  );
};

export default PageMeta;
