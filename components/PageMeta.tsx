import { type NextPageContext } from 'next';
import Head from 'next/head';

import { BASE_META } from '~/util/Constants';
import getApiUrl from '~/util/getApiUrl';

type PageMetaProps = {
  title?: string;
  description?: string;
  path?: string;
  searchQuery?: string | string[];
};

export default function PageMeta({
  title,
  searchQuery,
  path,
  description = BASE_META.description,
}: PageMetaProps) {
  const pageTitle = `${title ? title + ' • ' : ''}${BASE_META.title}`;
  const parsedSearchQuery = Array.isArray(searchQuery) ? searchQuery[0] : searchQuery;
  const finalDescription = parsedSearchQuery
    ? `Search results for keyword: '${parsedSearchQuery}'`
    : description;

  const socialImage = getApiUrl(
    `/proxy/og?title=${encodeURIComponent(pageTitle)}&description=${encodeURIComponent(finalDescription)}`,
    {} as NextPageContext
  );

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={socialImage} />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="669" />

      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={socialImage} />

      <link rel="canonical" href={`https://reactnative.directory${path ? `/${path}` : ''}`} />
    </Head>
  );
}
