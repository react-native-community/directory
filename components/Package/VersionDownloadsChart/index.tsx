import { ParentSize } from '@visx/responsive';
import { Axis, BarSeries, Grid, Tooltip, XYChart } from '@visx/xychart';
import { keyBy } from 'es-toolkit/array';
import { omit } from 'es-toolkit/object';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { Label } from '~/common/styleguide';
import { type NpmPerVersionDownloads, type NpmRegistryData } from '~/types';
import { formatNumberToString, pluralize } from '~/util/strings';
import tw from '~/util/tailwind';

import {
  type AggregatedChartMode,
  type ChartData,
  type ChartEntryKind,
  type ChartMode,
  type ChartSeriesByMode,
} from './types';
import {
  buildBaseChartSeries,
  buildChartSeriesByMode,
  CHART_MODE_QUERY_PARAM,
  createVersionChartEntry,
  DEFAULT_CHART_MODE,
  getChartLeftMargin,
  getLargestSeriesLength,
  getPrimaryChartLabel,
  LABEL_TO_BAR_GAP,
  mapVersionDistTags,
  parseChartMode,
} from './utils';
import VersionDownloadsChartModes from './VersionDownloadsChartModes';

type Props = {
  npmDownloads: NpmPerVersionDownloads;
  registryData: NpmRegistryData;
};

const DIST_TAG_LABEL_STYLE = {
  fontWeight: 400,
  fontSize: 10,
};

export default function VersionDownloadsChart({ npmDownloads, registryData }: Props) {
  const isDark = tw.prefixMatch('dark');

  const router = useRouter();
  const routeMode = useMemo(
    () => parseChartMode(router.query[CHART_MODE_QUERY_PARAM]),
    [router.query]
  );
  const [mode, setMode] = useState<ChartMode>(routeMode);

  useEffect(() => {
    setMode(currentMode => (currentMode === routeMode ? currentMode : routeMode));
  }, [routeMode]);

  const versionDistTags = useMemo(() => mapVersionDistTags(registryData), [registryData]);
  const baseSeries = useMemo<ChartData[]>(
    () => buildBaseChartSeries(npmDownloads, registryData, versionDistTags),
    [npmDownloads, registryData, versionDistTags]
  );
  const chartSeriesByMode = useMemo<ChartSeriesByMode>(
    () => buildChartSeriesByMode(baseSeries),
    [baseSeries]
  );
  const series = chartSeriesByMode[mode];
  const seriesByLabel = useMemo<Record<string, ChartData>>(
    () => keyBy(series, item => item.label),
    [series]
  );
  const leftMargin = useMemo(() => getChartLeftMargin(series), [series]);

  if (!series.length) {
    return (
      <View style={tw`min-h-[220px] items-center justify-center`}>
        <Label style={tw`text-secondary`}>Download data unavailable</Label>
      </View>
    );
  }

  const height = Math.max(120, getLargestSeriesLength(chartSeriesByMode) * 27 + 42);
  const maxDownloads = Math.max(...series.map((item: ChartData) => item.downloads), 0);
  const xDomain = maxDownloads ? [0, maxDownloads + Math.max(1, maxDownloads * 0.05)] : undefined;

  function handleModeChange(nextMode: ChartMode) {
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);

    const queryParams = omit(router.query, [CHART_MODE_QUERY_PARAM]);

    void router.replace(
      {
        pathname: router.pathname,
        query:
          nextMode === DEFAULT_CHART_MODE
            ? queryParams
            : { ...queryParams, [CHART_MODE_QUERY_PARAM]: nextMode },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  }

  return (
    <View style={tw`w-full gap-3`}>
      <VersionDownloadsChartModes mode={mode} onModeChange={handleModeChange} />
      <ParentSize>
        {({ width }) => {
          if (!width) {
            return <View style={{ height }} />;
          }

          return (
            <XYChart
              width={width}
              height={height}
              xScale={{ type: 'linear', domain: xDomain }}
              yScale={{ type: 'band', paddingInner: 0.23, paddingOuter: 0.15 }}
              margin={{ top: 2, right: 6, bottom: 20, left: leftMargin }}>
              <Grid
                columns
                rows={false}
                lineStyle={{
                  stroke: isDark ? '#374151' : '#e5e7eb',
                  strokeOpacity: isDark ? 0.66 : 1,
                  strokeWidth: isDark ? 0.5 : 0.66,
                }}
              />
              <Axis
                orientation="bottom"
                numTicks={5}
                hideAxisLine
                hideTicks
                tickFormat={value => formatNumberToString(value)}
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
                  const data =
                    seriesByLabel[formattedValue] ?? createVersionChartEntry(formattedValue);
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
                        <tspan
                          x={labelX}
                          dy="1.2em"
                          fill="var(--secondary)"
                          style={DIST_TAG_LABEL_STYLE}>
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
                xAccessor={(item: ChartData) => item.downloads}
                yAccessor={(item: ChartData) => item.label}
                colorAccessor={(item: ChartData) => {
                  const { kind, distTags } = item;

                  if (kind === 'other') {
                    return 'var(--pewter)';
                  }

                  if (distTags?.length) {
                    return isDark ? 'var(--primary)' : 'var(--primary-dark)';
                  }

                  return 'var(--primary-darker)';
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
    </View>
  );
}

function isAggregatedKind(kind: ChartEntryKind): kind is AggregatedChartMode {
  return kind === 'minor' || kind === 'major';
}

function renderTooltipContent(data?: ChartData) {
  if (!data) {
    return null;
  }

  return (
    <Text
      style={tw`font-sans flex flex-col gap-px rounded bg-black px-2.5 py-1.5 text-xs font-light text-white dark:border dark:border-default`}>
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
    </Text>
  );
}
