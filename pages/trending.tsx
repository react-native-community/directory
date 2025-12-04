import { type NextPageContext } from 'next';

import TrendingScene from '~/scenes/TrendingScene';
import { type APIResponseType, type QueryOrder } from '~/types';
import { type TrendingPageProps } from '~/types/pages';
import getApiUrl from '~/util/getApiUrl';
import urlWithQuery from '~/util/urlWithQuery';

function TrendingPage({ data, query }: TrendingPageProps) {
  return <TrendingScene data={data} query={query} />;
}

TrendingPage.getInitialProps = async (ctx: NextPageContext) => {
  const query = {
    ...ctx.query,
    ...{ minPopularity: '15', minMonthlyDownloads: '5000', order: 'popularity' as QueryOrder },
  };
  const url = getApiUrl(urlWithQuery('/libraries', query), ctx);
  const response = await fetch(url);
  const result: APIResponseType = await response.json();

  return {
    data: result,
    query,
  };
};

export default TrendingPage;
