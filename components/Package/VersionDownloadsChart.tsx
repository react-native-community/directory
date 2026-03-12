import { ParentSize } from '@visx/responsive';
import { Axis, BarSeries, Grid, Tooltip, XYChart } from '@visx/xychart';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { Label } from '~/common/styleguide';
import { type NpmPerVersionDownloads, type NpmRegistryData } from '~/types';
import { formatNumberToString } from '~/util/strings';
import tw from '~/util/tailwind';

type Props = {
  npmDownloads: NpmPerVersionDownloads;
  registryData: NpmRegistryData;
  height?: number;
  limit?: number;
};

type ChartData = {
  version: string;
  downloads: number;
  publishedAt?: string;
  isAggregate?: boolean;
};

const VERSIONS_LIMIT = 12;
const OTHER_VERSION_LABEL = 'Other';
const AXIS_LABEL_STYLE = {
  fontSize: 12,
  fontWeight: 400,
  letterSpacing: 0,
};

export default function VersionDownloadsChart({
  npmDownloads,
  registryData,
  height,
  limit = VERSIONS_LIMIT,
}: Props) {
  const isDark = tw.prefixMatch('dark');
  const series = useMemo(
    () => buildChartSeries(npmDownloads, registryData, limit),
    [limit, npmDownloads, registryData]
  );

  const chartHeight = height ?? Math.max(120, series.length * 26 + 42);
  const maxDownloads = Math.max(...series.map(item => item.downloads), 0);
  const xDomain = maxDownloads ? [0, maxDownloads + Math.max(1, maxDownloads * 0.05)] : undefined;
  const gridColor = isDark ? '#374151' : '#e5e7eb';

  if (!series.length) {
    return (
      <View style={tw`min-h-[220px] items-center justify-center`}>
        <Label style={tw`text-secondary`}>Download data unavailable</Label>
      </View>
    );
  }

  return (
    <ParentSize>
      {({ width }) => {
        if (!width) {
          return <View style={{ height: chartHeight }} />;
        }

        return (
          <XYChart
            width={width}
            height={chartHeight}
            xScale={{ type: 'linear', domain: xDomain }}
            yScale={{ type: 'band', paddingInner: 0.3, paddingOuter: 0.3 }}
            margin={{ top: 6, right: 8, bottom: 20, left: 54 }}>
            <Grid
              columns
              rows={false}
              lineStyle={{
                stroke: gridColor,
                strokeOpacity: isDark ? 0.66 : 1,
                strokeWidth: isDark ? 0.5 : 0.66,
              }}
            />
            <Axis
              orientation="bottom"
              numTicks={4}
              hideAxisLine
              hideTicks
              tickFormat={value => formatNumberToString(value)}
              tickLabelProps={() => ({
                fill: 'var(--secondary)',
                textAnchor: 'middle',
                ...AXIS_LABEL_STYLE,
              })}
            />
            <Axis
              orientation="left"
              hideAxisLine
              hideTicks
              numTicks={series.length}
              tickLabelProps={() => ({
                fill: isDark ? 'var(--white)' : 'var(--black)',
                textAnchor: 'end',
                ...AXIS_LABEL_STYLE,
              })}
            />
            <BarSeries
              dataKey="downloads"
              data={series}
              xAccessor={item => item.downloads}
              yAccessor={item => item.version}
              colorAccessor={({ isAggregate }) =>
                isAggregate
                  ? 'var(--pewter)'
                  : isDark
                    ? 'var(--primary-dark)'
                    : 'var(--primary-darker)'
              }
              radius={3}
              radiusAll
            />
            <Tooltip<ChartData>
              showVerticalCrosshair={false}
              showSeriesGlyphs={false}
              offsetLeft={8}
              offsetTop={6}
              detectBounds
              unstyled
              applyPositionStyle
              renderTooltip={({ tooltipData }) =>
                renderTooltipContent(tooltipData?.nearestDatum?.datum)
              }
            />
          </XYChart>
        );
      }}
    </ParentSize>
  );
}

function buildChartSeries(
  npmDownloads: NpmPerVersionDownloads,
  registryData: NpmRegistryData,
  limit: number
): ChartData[] {
  const sortedVersions = Object.entries(npmDownloads.downloads)
    .filter(([version, downloads]) => downloads > 0 && registryData.versions[version])
    .sort(
      ([leftVersion, leftDownloads], [rightVersion, rightDownloads]) =>
        rightDownloads - leftDownloads ||
        (registryData.time[rightVersion] ?? '').localeCompare(registryData.time[leftVersion] ?? '')
    )
    .map(([version, downloads]) => ({
      version,
      downloads,
      publishedAt: registryData.time[version],
    }));

  const normalizedLimit = Math.max(1, limit);

  if (sortedVersions.length <= normalizedLimit) {
    return [...sortedVersions].reverse();
  }

  const visibleVersionCount = Math.max(1, normalizedLimit - 1);
  const visibleVersions = sortedVersions.slice(0, visibleVersionCount).reverse();
  const otherDownloads = sortedVersions
    .slice(visibleVersionCount)
    .reduce((sum, item) => sum + item.downloads, 0);

  return otherDownloads > 0
    ? [
        {
          version: OTHER_VERSION_LABEL,
          downloads: otherDownloads,
          isAggregate: true,
        },
        ...visibleVersions,
      ]
    : visibleVersions;
}

function renderTooltipContent(data?: ChartData) {
  if (!data) {
    return null;
  }

  return (
    <Text
      style={tw`font-sans flex flex-col rounded bg-black px-2.5 py-1.5 text-xs font-light text-white dark:border dark:border-default`}>
      <span style={tw`font-medium`}>{data.version}</span>
      <span>{data.downloads.toLocaleString()} downloads last week</span>
      {data.publishedAt && !data.isAggregate ? (
        <span style={tw`text-palette-gray3 dark:text-secondary`}>
          Published {new Date(data.publishedAt).toLocaleDateString('en-US')}
        </span>
      ) : null}
    </Text>
  );
}
