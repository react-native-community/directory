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
  query?: string | string[];
};

const PageMeta = ({ title, query, path, description = site.description }: PageMetaProps) => {
  const pageTitle = `${title ? title + ' • ' : ''}${site.title}`;
  const parsedQuery = Array.isArray(query) ? query[0] : query;
  const finalDescription = parsedQuery
    ? `Search results for keyword: '${parsedQuery}'`
    : description;

  const socialImage = `${BASE_OG_URL}&title=${encodeURIComponent(pageTitle)}&description=${encodeURIComponent(finalDescription)}`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:site_name" content={site.title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://reactnative.directory" />
      <meta property="og:image" content={socialImage} />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="669" />

      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={socialImage} />

      <meta name="application-name" content={site.title} />
      <meta name="msapplication-TileColor" content="#20232a" />

      <link rel="canonical" href={`https://reactnative.directory${path ? `/${path}` : ''}`} />
    </Head>
  );
};

export default PageMeta;
