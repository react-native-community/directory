import { cloneDeep } from 'es-toolkit/object';
import { type NextPageContext } from 'next';

import HomeScene from '~/scenes/HomeScene';
import { type HomePageProps } from '~/types/pages';
import { ssrFetch } from '~/util/SSRFetch';
import urlWithQuery from '~/util/urlWithQuery';

function Index(props: HomePageProps) {
  return <HomeScene {...cloneDeep(props)} />;
}

const LIMIT = 8;

Index.getInitialProps = async (ctx: NextPageContext) => {
  if (ctx.res && ctx.query && Object.keys(ctx.query).length > 0) {
    ctx.res.writeHead(302, {
      Location: urlWithQuery('/packages', ctx.query),
    });
    ctx.res.end();
    return;
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
    { order: 'added', limit: LIMIT.toString() },
    ctx
  );
  const recentlyUpdatedResponse = await ssrFetch(
    '/libraries',
    { order: 'updated', limit: LIMIT.toString() },
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
    mostDownloaded: await mostDownloadedResponse.json(),
    recentlyAdded: await recentlyAddedResponse.json(),
    recentlyUpdated: await recentlyUpdatedResponse.json(),
    popular: await popularResponse.json(),
    statistic: await statisticResponse.json(),
  };
};

export default Index;
