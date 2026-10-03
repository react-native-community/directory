import dynamic from 'next/dynamic';
import { View } from 'react-native';

import { H2 } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import Navigation from '~/components/Navigation';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import PageMeta from '~/components/PageMeta';
import StatisticChartHeader from '~/components/Statistics/StatisticChartHeader';
import { type LintToolType, type StatisticResultType } from '~/types';
import { formatLintTools } from '~/util/strings';
import tw from '~/util/tailwind';

const StatisticsBarChart = dynamic(() => import('~/components/Statistics/StatisticsBarChart'), {
  ssr: false,
  loading: () => (
    <View style={tw`min-h-[220px] items-center justify-center`}>
      <ThreeDotsLoader />
    </View>
  ),
});

type Props = {
  statistic: StatisticResultType;
};

export default function StatisticsScene({ statistic }: Props) {
  const platforms = [
    { label: 'Android', count: statistic.android },
    { label: 'iOS', count: statistic.ios },
    { label: 'macOS', count: statistic.macos },
    { label: 'tvOS', count: statistic.tvos },
    { label: 'visionOS', count: statistic.visionos },
    { label: 'Web', count: statistic.web },
    { label: 'Windows', count: statistic.windows },
    { label: 'Fire OS', count: statistic.fireos },
    { label: 'HarmonyOS', count: statistic.harmony },
    { label: 'Horizon OS', count: statistic.horizon },
    { label: 'Vega OS', count: statistic.vegaos },
    { label: 'Expo Go', count: statistic.expoGo },
  ];

  const packageManagers = [
    { label: 'npm', count: statistic.packageManager.npm },
    { label: 'Yarn', count: statistic.packageManager.yarn },
    { label: 'pnpm', count: statistic.packageManager.pnpm },
    { label: 'Bun', count: statistic.packageManager.bun },
    {
      label: 'Unknown',
      count:
        statistic.total -
        statistic.packageManager.npm -
        statistic.packageManager.yarn -
        statistic.packageManager.pnpm -
        statistic.packageManager.bun,
      secondary: true,
    },
  ];

  const moduleTypes = [
    { label: 'Expo module', count: statistic.moduleType.expo },
    { label: 'Nitro module', count: statistic.moduleType.nitro },
    { label: 'Turbo module', count: statistic.moduleType.turbo },
  ];

  const lintTools = Object.entries(statistic.lintTools).map(([tool, count]) => ({
    label: formatLintTools(tool as LintToolType),
    count,
  }));

  const dependencyBuckets = statistic.dependencyBuckets.map(bucket => ({
    ...bucket,
    secondary: bucket.label === 'Unknown',
  }));

  const bundleSizeBuckets = statistic.bundleSizeBuckets.map(bucket => ({
    ...bucket,
    secondary: bucket.label === 'Unknown',
  }));

  return (
    <>
      <PageMeta
        title="Statistics"
        description="Detailed statistics for every React Native library in the directory."
        path="stats"
      />
      <Navigation
        title="Statistics"
        description="Detailed statistics for every React Native library in the directory"
      />
      <ContentContainer style={tw`my-8 mb-16 gap-4 px-4`}>
        <H2 style={tw`text-center`}>Libraries statistics</H2>
        <StatisticChartHeader title="Platform support" large />
        <StatisticsBarChart data={platforms} total={statistic.total} />
        <StatisticChartHeader title="New Architecture" large />
        <StatisticsBarChart
          data={[
            { label: 'Supporting', count: statistic.newArchitecture },
            {
              label: 'Not supporting',
              count: statistic.total - statistic.newArchitecture,
              secondary: true,
            },
          ]}
          total={statistic.total}
        />
        <StatisticChartHeader title="Direct dependencies count distribution" large />
        <StatisticsBarChart
          data={dependencyBuckets}
          total={statistic.total}
          sortByValue={false}
          reverseOrder
        />
        <StatisticChartHeader title="Library bundle size distribution" large />
        <StatisticsBarChart
          data={bundleSizeBuckets}
          total={statistic.total}
          sortByValue={false}
          reverseOrder
        />
        <H2 style={tw`mt-8 text-center`}>Development stack and tooling</H2>
        <StatisticChartHeader title="Native module framework" large />
        <StatisticsBarChart data={moduleTypes} total={statistic.total} />
        <StatisticChartHeader title="Native code used" large />
        <StatisticsBarChart
          data={[
            { label: 'Yes', count: statistic.withNativeCode },
            {
              label: 'No',
              count: statistic.total - statistic.withNativeCode,
              secondary: true,
            },
          ]}
          total={statistic.total}
        />
        <StatisticChartHeader title="Package manager" large />
        <StatisticsBarChart data={packageManagers} total={statistic.total} />
        <StatisticChartHeader title="Lint tools" large />
        <StatisticsBarChart data={lintTools} total={statistic.total} />
        <H2 style={tw`mt-8 text-center`}>Directory metadata</H2>
        <StatisticChartHeader title="Directory score distribution" large />
        <StatisticsBarChart
          data={statistic.scoreBuckets}
          total={statistic.total}
          sortByValue={false}
        />
      </ContentContainer>
    </>
  );
}
