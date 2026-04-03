import { type GetServerSidePropsContext } from 'next';

import HomeScene from '~/scenes/HomeScene';
import { type HomePageProps } from '~/types/pages';
import { ssrFetch } from '~/util/SSRFetch';
import urlWithQuery from '~/util/urlWithQuery';

function Index(props: HomePageProps) {
  return <HomeScene {...props} />;
}

const LIMIT = 8;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  if (Object.keys(ctx.query).length > 0) {
    return {
      redirect: {
        destination: urlWithQuery('/packages', ctx.query),
        permanent: false,
      },
    };
  }

  const mostDownloadedResponse = await ssrFetch(
    '/libraries',
    {
      order: 'downloads',
      limit: LIMIT.toString(),
      isMaintained: 'true',
      hasNativeCode: 'true',
    },
    ctx
  );
  const recentlyAddedResponse = await ssrFetch(
    '/libraries',
    { order: 'added', limit: LIMIT.toString(), isMaintained: 'true' },
    ctx
  );
  const recentlyUpdatedResponse = await ssrFetch(
    '/libraries',
    { order: 'updated', limit: LIMIT.toString(), isMaintained: 'true' },
    ctx
  );
  const popularResponse = await ssrFetch(
    '/libraries',
    {
      order: 'popularity',
      limit: LIMIT.toString(),
      isMaintained: 'true',
      isPopular: 'true',
      wasRecentlyUpdated: 'true',
    },
    ctx
  );

  const statisticResponse = await ssrFetch('/libraries/statistic', {}, ctx);

  return {
    props: {
      mostDownloaded: await mostDownloadedResponse.json(),
      recentlyAdded: await recentlyAddedResponse.json(),
      recentlyUpdated: await recentlyUpdatedResponse.json(),
      popular: await popularResponse.json(),
      statistic: await statisticResponse.json(),
    },
  };
}

export default Index;
