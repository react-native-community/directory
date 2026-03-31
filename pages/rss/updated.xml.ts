import { type NextPageContext } from 'next';

import { type APIResponseType } from '~/types';
import { generateLibrariesRss } from '~/util/rss';
import { ssrFetch } from '~/util/SSRFetch';

const RSS_LIMIT = 20;

export async function getServerSideProps(ctx: NextPageContext) {
  const { res } = ctx;

  if (!res) {
    return { notFound: true };
  }

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300');

  try {
    const response = await ssrFetch(
      '/libraries',
      { order: 'updated', limit: RSS_LIMIT.toString() },
      ctx
    );

    const { libraries } = (await response.json()) as APIResponseType;

    res.statusCode = 200;
    res.write(
      generateLibrariesRss(
        'Just Updated',
        'The recently updated packages in the directory',
        libraries
      )
    );
  } catch {
    res.statusCode = 500;
    res.write('Error: Cannot generate RSS feed');
  }

  res.end();

  return { props: {} };
}

export default function RSSFeedAdded() {
  return null;
}
