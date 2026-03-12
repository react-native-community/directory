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
  distTags?: string[];
};

const VERSIONS_LIMIT = 12;
const OTHER_VERSION_LABEL = 'Other';
const DIST_TAG_LABEL_STYLE = {
  fontWeight: 400,
  fontSize: 10,
};

export default function VersionDownloadsChart({
  npmDownloads,
  registryData,
  height,
  limit = VERSIONS_LIMIT,
}: Props) {
  const isDark = tw.prefixMatch('dark');
  const versionDistTags = useMemo(() => mapVersionDistTags(registryData), [registryData]);
  const series = useMemo(
    () => buildChartSeries(npmDownloads, registryData, versionDistTags, limit),
    [limit, npmDownloads, registryData, versionDistTags]
  );

  const chartHeight = height ?? Math.max(120, series.length * 27 + 42);
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
            yScale={{ type: 'band', paddingInner: 0.23, paddingOuter: 0.15 }}
            margin={{ top: 6, right: 2, bottom: 20, left: 60 }}>
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
              tickComponent={({ formattedValue = 'unknown', x, y }) => {
                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={tw`select-none tabular-nums`}
                    fill="var(--secondary)">
                    <tspan x={x} style={tw`text-[12px] font-light`}>
                      {formattedValue}
                    </tspan>
                  </text>
                );
              }}
            />
            <Axis
              orientation="left"
              hideAxisLine
              hideTicks
              numTicks={series.length}
              tickComponent={({ formattedValue = 'unknown', x, y }) => {
                const labelX = (x ?? 0) - 4;
                const data = series.find(item => item.version === formattedValue);
                const hasDistTags = Boolean(data?.distTags?.length);
                const [version, suffix] = formattedValue.split('-');

                return (
                  <text
                    x={labelX}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    style={tw`select-none tabular-nums`}
                    fill={isDark ? 'var(--white)' : 'var(--black)'}>
                    <tspan
                      x={labelX}
                      dy={hasDistTags || suffix ? '-0.44em' : '0'}
                      style={tw`text-[12px]`}>
                      {version}
                    </tspan>
                    {hasDistTags && (
                      <tspan
                        x={labelX}
                        dy="1.2em"
                        fill="var(--secondary)"
                        style={DIST_TAG_LABEL_STYLE}>
                        {data?.distTags?.join(', ')}
                      </tspan>
                    )}
                    {suffix && !hasDistTags && (
                      <tspan
                        x={labelX}
                        dy="1.2em"
                        fill="var(--secondary)"
                        style={DIST_TAG_LABEL_STYLE}>
                        {suffix}
                      </tspan>
                    )}
                  </text>
                );
              }}
            />
            <BarSeries
              dataKey="downloads"
              data={series}
              xAccessor={item => item.downloads}
              yAccessor={item => item.version}
              colorAccessor={({ isAggregate, distTags }) => {
                if (isAggregate) {
                  return 'var(--pewter)';
                }
                if (distTags?.length) {
                  return isDark ? 'var(--primary)' : 'var(--primary-dark)';
                }
                return isDark ? 'var(--primary-darker)' : 'var(--primary-darker)';
              }}
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
  versionDistTags: Record<string, string[]>,
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
      distTags: versionDistTags[version],
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
      style={tw`font-sans flex flex-col gap-px rounded bg-black px-2.5 py-1.5 text-xs font-light text-white dark:border dark:border-default`}>
      <span style={tw`text-[14px] font-medium tabular-nums`}>
        {data.version}
        {data.distTags?.length && (
          <span style={tw`text-palette-gray3 dark:text-secondary`}>
            {` `}• {data.distTags.join(', ')}
          </span>
        )}
      </span>
      <span>{data.downloads.toLocaleString()} downloads last week</span>
      {data.publishedAt && !data.isAggregate ? (
        <span style={tw`text-palette-gray3 dark:text-secondary`}>
          Published {new Date(data.publishedAt).toLocaleDateString('en-US')}
        </span>
      ) : null}
    </Text>
  );
}

function mapVersionDistTags(registryData: NpmRegistryData) {
  return Object.entries(registryData['dist-tags']).reduce<Record<string, string[]>>(
    (acc, [tag, version]) => {
      acc[version] = [...(acc[version] ?? []), tag];
      return acc;
    },
    {}
  );
}
