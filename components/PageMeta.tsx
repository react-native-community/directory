import Head from 'next/head';

const site = {
  title: 'React Native Directory',
  description: 'An interactive directory to find packages for your React Native apps.',
};

const BASE_OG_URL = 'https://og.expo.dev/?theme=rnd';

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
  description = site.description,
}: PageMetaProps) {
  const pageTitle = `${title ? title + ' • ' : ''}${site.title}`;
  const parsedSearchQuery = Array.isArray(searchQuery) ? searchQuery[0] : searchQuery;
  const finalDescription = parsedSearchQuery
    ? `Search results for keyword: '${parsedSearchQuery}'`
    : description;

  const socialImage = `${BASE_OG_URL}&title=${encodeURIComponent(pageTitle)}&description=${encodeURIComponent(finalDescription)}`;

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
