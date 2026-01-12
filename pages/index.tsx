import { type NextPageContext } from 'next';

import HomeScene from '~/scenes/HomeScene';
import { type HomePageProps } from '~/types/pages';
import getApiUrl from '~/util/getApiUrl';
import urlWithQuery from '~/util/urlWithQuery';

function Index(props: HomePageProps) {
  return <HomeScene {...props} />;
}

const LIMIT = 6;

Index.getInitialProps = async (ctx: NextPageContext) => {
  console.warn(ctx.query);
  if (ctx.res && ctx.query && Object.keys(ctx.query).length > 0) {
    ctx.res.writeHead(302, {
      Location: urlWithQuery('/packages', ctx.query),
    });
    ctx.res.end();
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
    )
  );
  const recentlyAddedResponse = await fetch(
    getApiUrl(urlWithQuery('/libraries', { order: 'added', limit: LIMIT.toString() }), ctx)
  );
  const recentlyUpdatedResponse = await fetch(
    getApiUrl(urlWithQuery('/libraries', { order: 'updated', limit: LIMIT.toString() }), ctx)
  );

  const statisticResponse = await fetch(getApiUrl(urlWithQuery('/libraries/statistic', {}), ctx));

  return {
    mostDownloaded: await mostDownloadedResponse.json(),
    recentlyAdded: await recentlyAddedResponse.json(),
    recentlyUpdated: await recentlyUpdatedResponse.json(),
    statistic: await statisticResponse.json(),
  };
};

export default Index;
