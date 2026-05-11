import { type NextPageContext } from 'next';

import TrendingScene from '~/scenes/TrendingScene';
import { type QueryOrder } from '~/types';
import { type TrendingPageProps } from '~/types/pages';
import { ssrFetch } from '~/util/SSRFetch';

function TrendingPage({ data, query }: TrendingPageProps) {
  return <TrendingScene data={data} query={query} />;
}

TrendingPage.getInitialProps = async (ctx: NextPageContext) => {
  const query = {
    ...ctx.query,
    minPopularity: '15',
    minMonthlyDownloads: '5000',
    order: 'popularity' as QueryOrder,
  };
  const response = await ssrFetch('/libraries', query, ctx);

  return {
    data: await response.json(),
    query,
  };
};

export default TrendingPage;
