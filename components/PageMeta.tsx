import getShareImage from '@jlengstorf/get-share-image';
import Head from 'next/head';

const site = {
  title: 'React Native Directory',
  description: 'An interactive directory to find packages for your React Native apps.',
};

type PageMetaProps = {
  title?: string;
  description?: string;
  path?: string;
  query?: string | string[];
};

const PageMeta = ({ title, query, path, description = site.description }: PageMetaProps) => {
  const pageTitle = `${title ? title + ' • ' : ''}${site.title}`;
  const parsedQuery = Array.isArray(query) ? query[0] : query;

  const socialImage = getShareImage({
    title: site.title,
    tagline: parsedQuery ? `Search results for keyword:\n"${parsedQuery}"` : description,
    cloudName: 'react-native-directory',
    imagePublicID: 'share-bg',
    titleColor: 'fff',
    titleFont: 'roboto',
    titleFontSize: 66,
    taglineFont: 'roboto',
    taglineColor: 'aeb1bc',
    titleBottomOffset: 372,
    taglineTopOffset: 324,
  });

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={pageTitle} />
      <meta
        property="og:description"
        content={parsedQuery ? `Search results for keyword: '${parsedQuery}'` : description}
      />
      <meta property="og:site_name" content={site.title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://reactnative.directory" />
      <meta property="og:image" content={socialImage} />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="669" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={socialImage} />

      <meta name="application-name" content={site.title} />
      <meta name="msapplication-TileColor" content="#20232a" />

      <link rel="canonical" href={`https://reactnative.directory${path ? `/${path}` : ''}`} />
    </Head>
  );
};

export default PageMeta;
