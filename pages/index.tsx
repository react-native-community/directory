import { type NextPageContext } from 'next';

import HomeScene from '~/scenes/HomeScene';
import { type HomePageProps } from '~/types/pages';
import { NEXT_1H_CACHE_HEADER } from '~/util/Constants';
import getApiUrl from '~/util/getApiUrl';
import urlWithQuery from '~/util/urlWithQuery';

function Index(props: HomePageProps) {
  return <HomeScene {...props} />;
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

  const mostDownloadedResponse = await fetch(
    getApiUrl(
      urlWithQuery('/libraries', {
        order: 'downloads',
        limit: LIMIT.toString(),
        isMaintained: 'true',
        hasNativeCode: 'true',
      }),
      ctx
    ),
    NEXT_1H_CACHE_HEADER
  );
  const recentlyAddedResponse = await fetch(
    getApiUrl(urlWithQuery('/libraries', { order: 'added', limit: LIMIT.toString() }), ctx),
    NEXT_1H_CACHE_HEADER
  );
  const recentlyUpdatedResponse = await fetch(
    getApiUrl(urlWithQuery('/libraries', { order: 'updated', limit: LIMIT.toString() }), ctx),
    NEXT_1H_CACHE_HEADER
  );
  const popularResponse = await fetch(
    getApiUrl(
      urlWithQuery('/libraries', {
        order: 'popularity',
        limit: LIMIT.toString(),
        isMaintained: 'true',
        isPopular: 'true',
        wasRecentlyUpdated: 'true',
      }),
      ctx
    ),
    NEXT_1H_CACHE_HEADER
  );

  const statisticResponse = await fetch(
    getApiUrl(urlWithQuery('/libraries/statistic', {}), ctx),
    NEXT_1H_CACHE_HEADER
  );

  return {
    mostDownloaded: await mostDownloadedResponse.json(),
    recentlyAdded: await recentlyAddedResponse.json(),
    recentlyUpdated: await recentlyUpdatedResponse.json(),
    popular: await popularResponse.json(),
    statistic: await statisticResponse.json(),
  };
};

export default Index;
