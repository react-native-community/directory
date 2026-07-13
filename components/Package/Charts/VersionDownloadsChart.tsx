import { LinearGradient } from '@visx/gradient';
import { useParentSize } from '@visx/responsive';
import { Axis, BarSeries, Grid, Tooltip, XYChart } from '@visx/xychart';
import { keyBy } from 'es-toolkit/array';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { View } from 'react-native';

import { Label } from '~/common/styleguide';
import { type NpmPerVersionDownloads, type PackageVersionsData } from '~/types';
import { replaceQueryParam } from '~/util/queryParams';
import { NUMBER_FORMATTER, pluralize } from '~/util/strings';
import tw from '~/util/tailwind';

import ChartTooltip from './ChartTooltip';
import HoveredBarOutline from './HoveredBarOutline';
import {
  type VersionsAggregatedChartMode,
  type VersionsChartData,
  type VersionsChartEntryKind,
  type VersionsChartMode,
} from './types';
import {
  buildBaseChartSeries,
  buildChartSeriesByMode,
  CHART_MODE_QUERY_PARAM,
  createVersionChartEntry,
  DEFAULT_CHART_MODE,
  getChartLeftMargin,
  getLargestSeriesLength,
  getLatestVersionDownloadsPercentage,
  getPrimaryChartLabel,
  LABEL_TO_BAR_GAP,
  mapVersionDistTags,
  parseChartMode,
} from './utils';
import VersionDownloadsChartModes from './VersionDownloadsChartModes';

type Props = {
  npmDownloads: NpmPerVersionDownloads;
  registryData: PackageVersionsData;
};

const TAGGED_BAR_GRADIENT_ID = 'version-downloads-chart-gradient-tagged';
const BAR_GRADIENT_ID = 'version-downloads-chart-gradient';
const OTHER_BAR_GRADIENT_ID = 'version-downloads-chart-other';

export default function VersionDownloadsChart({ npmDownloads, registryData }: Props) {
  const isDark = tw.prefixMatch('dark');

  const router = useRouter();
  const routeMode = parseChartMode(router.query[CHART_MODE_QUERY_PARAM]);
  const { parentRef, width } = useParentSize({ debounceTime: 150 });
  const [mode, setMode] = useState<VersionsChartMode>(routeMode);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const versionDistTags = mapVersionDistTags(registryData);
  const baseSeries = buildBaseChartSeries(npmDownloads, registryData, versionDistTags);
  const chartSeriesByMode = buildChartSeriesByMode(baseSeries);
  const series = chartSeriesByMode[mode];
  const seriesByLabel = keyBy(series, item => item.label);
  const leftMargin = getChartLeftMargin(series);
  const downloadsPercentage = getLatestVersionDownloadsPercentage(baseSeries, registryData, mode);

  if (!series.length) {
    return (
      <View style={tw`min-h-[220px] items-center justify-center`}>
        <Label style={tw`text-secondary`}>Download data unavailable</Label>
      </View>
    );
  }

  const height = Math.max(120, getLargestSeriesLength(chartSeriesByMode) * 27 + 42);
  const maxDownloads = Math.max(...series.map((item: VersionsChartData) => item.downloads), 0);
  const xDomain = maxDownloads ? [0, maxDownloads + Math.max(1, maxDownloads * 0.05)] : undefined;

  function handleModeChange(nextMode: VersionsChartMode) {
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);
    replaceQueryParam(
      router,
      CHART_MODE_QUERY_PARAM,
      nextMode === DEFAULT_CHART_MODE ? undefined : nextMode
    );
  }

  return (
    // @ts-expect-error Ref type miss-match
    <View style={tw`w-full gap-3`} ref={parentRef}>
      <VersionDownloadsChartModes
        mode={mode}
        onModeChange={handleModeChange}
        downloadsPercentage={downloadsPercentage}
      />
      <XYChart
        width={width}
        height={height}
        xScale={{ type: 'linear', domain: xDomain }}
        yScale={{ type: 'band', paddingInner: 0.23, paddingOuter: 0.15 }}
        margin={{ top: 2, right: 12, bottom: 20, left: leftMargin }}>
        <LinearGradient
          id={BAR_GRADIENT_ID}
          from={isDark ? 'var(--primary-darker)' : 'var(--primary-darker)'}
          to={isDark ? 'var(--primary-darker)' : 'var(--primary-darker)'}
          toOpacity={1}
          toOffset={0.75}
          fromOpacity={isDark ? 0.25 : 0.5}
          rotate={-90}
        />
        <LinearGradient
          id={TAGGED_BAR_GRADIENT_ID}
          from={isDark ? 'var(--primary)' : 'var(--primary-dark)'}
          to={isDark ? 'var(--primary)' : 'var(--primary-dark)'}
          toOpacity={1}
          toOffset={0.75}
          fromOpacity={isDark ? 0.25 : 0.5}
          rotate={-90}
        />
        <LinearGradient
          id={OTHER_BAR_GRADIENT_ID}
          from="var(--pewter)"
          to="var(--pewter)"
          toOpacity={1}
          toOffset={0.75}
          fromOpacity={isDark ? 0.25 : 0.5}
          rotate={-90}
        />
        <Grid
          columns
          rows={false}
          strokeDasharray="4 4"
          lineStyle={{
            stroke: isDark ? '#374151' : '#cecfd3',
            strokeOpacity: isDark ? 0.66 : 1,
            strokeWidth: 0.5,
          }}
        />
        <Axis
          orientation="bottom"
          numTicks={5}
          hideAxisLine
          hideTicks
          tickFormat={value => NUMBER_FORMATTER.format(value)}
          tickComponent={({ formattedValue = 'unknown', x, y }) => (
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
          )}
        />
        <Axis
          orientation="left"
          hideAxisLine
          hideTicks
          numTicks={series.length}
          tickComponent={({ formattedValue = 'unknown', x, y }) => {
            const data = seriesByLabel[formattedValue] ?? createVersionChartEntry(formattedValue);
            const labelX = (x ?? 0) - LABEL_TO_BAR_GAP;

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
                  dy={data.secondaryLabel ? '-0.44em' : '0'}
                  style={tw`text-[12px]`}>
                  {getPrimaryChartLabel(data)}
                </tspan>
                {data.secondaryLabel && (
                  <tspan x={labelX} dy="1.2em" fill="var(--secondary)" style={tw`text-[10px]`}>
                    {data.secondaryLabel}
                  </tspan>
                )}
              </text>
            );
          }}
        />
        <BarSeries
          dataKey="downloads"
          data={series}
          xAccessor={(item: VersionsChartData) => item.downloads}
          yAccessor={(item: VersionsChartData) => item.label}
          colorAccessor={(item: VersionsChartData) => {
            const { kind, distTags } = item;

            if (kind === 'other') {
              return `url(#${OTHER_BAR_GRADIENT_ID})`;
            }

            if (distTags?.length) {
              return `url(#${TAGGED_BAR_GRADIENT_ID})`;
            }

            return `url(#${BAR_GRADIENT_ID})`;
          }}
          radius={4}
          radiusAll
          onPointerMove={({ index }) => setHoveredIndex(index)}
          onPointerOut={() => setHoveredIndex(null)}
        />
        <HoveredBarOutline
          hoveredIndex={hoveredIndex}
          series={series}
          orientation="horizontal"
          xAccessor={item => item.downloads}
          yAccessor={item => item.label}
        />
        <Tooltip<VersionsChartData>
          showVerticalCrosshair={false}
          showSeriesGlyphs={false}
          offsetLeft={8}
          offsetTop={6}
          detectBounds
          unstyled
          applyPositionStyle
          renderTooltip={({ tooltipData }) => {
            const data = tooltipData?.nearestDatum?.datum;

            if (!data) {
              return null;
            }

            return (
              <ChartTooltip>
                <span style={tw`text-[14px] font-medium tabular-nums`}>
                  {data.label}
                  {data.distTags?.length && (
                    <span style={tw`text-palette-gray3 dark:text-secondary`}>
                      {` `}• {data.distTags.join(', ')}
                    </span>
                  )}
                </span>
                <span>{data.downloads.toLocaleString()} downloads last week</span>
                {isAggregatedKind(data.kind) && data.versionCount ? (
                  <span>{`${data.versionCount} ${pluralize('version', data.versionCount)} included`}</span>
                ) : null}
                {data.kind === 'other' && data.versionCount ? (
                  <span>{`${data.versionCount} ${pluralize('version', data.versionCount)} aggregated`}</span>
                ) : null}
                {data.publishedAt && data.kind !== 'other' ? (
                  <span style={tw`text-palette-gray3 dark:text-secondary`}>
                    {isAggregatedKind(data.kind) ? 'Latest publish' : 'Published'}{' '}
                    {new Date(data.publishedAt).toLocaleDateString('en-US')}
                  </span>
                ) : null}
              </ChartTooltip>
            );
          }}
        />
      </XYChart>
    </View>
  );
}

function isAggregatedKind(kind: VersionsChartEntryKind): kind is VersionsAggregatedChartMode {
  return kind === 'minor' || kind === 'major';
}
