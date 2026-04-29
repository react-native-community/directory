import { cloneDeep } from 'es-toolkit';
import { type GetServerSidePropsContext } from 'next';

import HomeScene from '~/scenes/HomeScene';
import { type HomePageProps } from '~/types/pages';
import { ssrFetch } from '~/util/SSRFetch';
import urlWithQuery from '~/util/urlWithQuery';

function Index(props: HomePageProps) {
  return <HomeScene {...cloneDeep(props)} />;
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

  const [
    mostDownloadedResponse,
    recentlyAddedResponse,
    recentlyUpdatedResponse,
    popularResponse,
    statisticResponse,
  ] = await Promise.all([
    ssrFetch(
      '/libraries',
      {
        order: 'downloads',
        limit: LIMIT.toString(),
        isMaintained: 'true',
        hasNativeCode: 'true',
      },
      ctx
    ),
    ssrFetch('/libraries', { order: 'added', limit: LIMIT.toString(), isMaintained: 'true' }, ctx),
    ssrFetch(
      '/libraries',
      { order: 'updated', limit: LIMIT.toString(), isMaintained: 'true' },
      ctx
    ),
    ssrFetch(
      '/libraries',
      {
        order: 'popularity',
        limit: LIMIT.toString(),
        isMaintained: 'true',
        isPopular: 'true',
        wasRecentlyUpdated: 'true',
      },
      ctx
    ),
    ssrFetch('/libraries/statistic', {}, ctx),
  ]);

  const [mostDownloaded, recentlyAdded, recentlyUpdated, popular, statistic] = await Promise.all([
    mostDownloadedResponse.json(),
    recentlyAddedResponse.json(),
    recentlyUpdatedResponse.json(),
    popularResponse.json(),
    statisticResponse.json(),
  ]);

  return {
    props: {
      mostDownloaded,
      recentlyAdded,
      recentlyUpdated,
      popular,
      statistic,
    },
  };
}

export default Index;
