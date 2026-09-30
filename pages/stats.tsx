import { type GetServerSidePropsContext } from 'next';

import StatisticsScene from '~/scenes/StatisticsScene';
import { type StatisticResultType } from '~/types';
import { ssrFetch } from '~/util/SSRFetch';

type StatsPageProps = {
  statistic: StatisticResultType;
};

export default function StatsPage({ statistic }: StatsPageProps) {
  return <StatisticsScene statistic={statistic} />;
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const response = await ssrFetch('/libraries/statistic', {}, ctx);

  return {
    props: {
      statistic: await response.json(),
    },
  };
}
