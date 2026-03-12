import { ParentSize } from '@visx/responsive';
import { Axis, BarSeries, Grid, Tooltip, XYChart } from '@visx/xychart';
import { clamp, keyBy, sumBy } from 'es-toolkit';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { Label } from '~/common/styleguide';
import { Button } from '~/components/Button';
import { type NpmPerVersionDownloads, type NpmRegistryData } from '~/types';
import { formatNumberToString, pluralize } from '~/util/strings';
import tw from '~/util/tailwind';

type Props = {
  npmDownloads: NpmPerVersionDownloads;
  registryData: NpmRegistryData;
};

type ChartData = {
  label: string;
  secondaryLabel?: string;
  downloads: number;
  publishedAt?: string;
  kind: ChartMode | 'other';
  distTags?: string[];
  versionCount?: number;
};

type ChartMode = 'version' | 'minor' | 'major';
type ChartModes = { key: ChartMode; label: string }[];
type AggregatedChartMode = Exclude<ChartMode, 'version'>;
type ChartSeriesByMode = Record<ChartMode, ChartData[]>;

const VERSIONS_LIMIT = 12;
const LABEL_TO_BAR_GAP = 6;
const PRIMARY_LABEL_FONT_SIZE = 12;
const SECONDARY_LABEL_FONT_SIZE = 10;
const MIN_YAXIS_LABEL_WIDTH = 72;
const DIST_TAG_LABEL_STYLE = {
  fontWeight: 400,
  fontSize: 10,
};
const OTHER_VERSION_LABEL = 'Other';
const TEXT_MEASURE_CANVAS_ID = 'measure-canvas';
const CHART_MODES: ChartModes = [
  { key: 'version', label: 'All versions' },
  { key: 'minor', label: 'By minor' },
  { key: 'major', label: 'By major' },
];

const YAxisLabelWidthCache = new Map<string, number>();

export default function VersionDownloadsChart({ npmDownloads, registryData }: Props) {
  const isDark = tw.prefixMatch('dark');
  const [mode, setMode] = useState<ChartMode>('version');

  const versionDistTags = useMemo(() => mapVersionDistTags(registryData), [registryData]);
  const baseSeries = useMemo(
    () => buildBaseChartSeries(npmDownloads, registryData, versionDistTags),
    [npmDownloads, registryData, versionDistTags]
  );
  const chartSeriesByMode = useMemo(() => buildChartSeriesByMode(baseSeries), [baseSeries]);
  const series = chartSeriesByMode[mode];
  const seriesByLabel = useMemo(() => keyBy(series, item => item.label), [series]);
  const leftMargin = useMemo(() => getChartLeftMargin(series), [series]);

  if (!series.length) {
    return (
      <View style={tw`min-h-[220px] items-center justify-center`}>
        <Label style={tw`text-secondary`}>Download data unavailable</Label>
      </View>
    );
  }

  const height = Math.max(120, getLargestSeriesLength(chartSeriesByMode) * 27 + 42);
  const maxDownloads = Math.max(...series.map(item => item.downloads), 0);
  const xDomain = maxDownloads ? [0, maxDownloads + Math.max(1, maxDownloads * 0.05)] : undefined;

  return (
    <View style={tw`w-full gap-3`}>
      <View style={tw`flex-row gap-2 self-start`}>
        {CHART_MODES.map(({ key, label }) => (
          <Button
            key={key}
            onPress={() => setMode(key)}
            style={[
              tw`min-w-[92px] border bg-default px-3 py-1.5`,
              key === mode
                ? tw`border-[#bde0f7] bg-primary-hover dark:border-[#203b4d]`
                : tw`border-default`,
            ]}>
            <Label
              style={key === mode ? tw`text-primary-darker dark:text-primary` : tw`text-secondary`}>
              {label}
            </Label>
          </Button>
        ))}
      </View>
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
                xAccessor={item => item.downloads}
                yAccessor={item => item.label}
                colorAccessor={({ kind, distTags }) => {
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

function buildBaseChartSeries(
  npmDownloads: NpmPerVersionDownloads,
  registryData: NpmRegistryData,
  versionDistTags: Record<string, string[]>
): ChartData[] {
  return Object.entries(npmDownloads.downloads)
    .filter(([version, downloads]) => downloads > 0 && registryData.versions[version])
    .sort(
      ([leftVersion, leftDownloads], [rightVersion, rightDownloads]) =>
        rightDownloads - leftDownloads ||
        (registryData.time[rightVersion] ?? '').localeCompare(registryData.time[leftVersion] ?? '')
    )
    .map(([version, downloads]) =>
      createVersionChartEntry(
        version,
        downloads,
        registryData.time[version],
        versionDistTags[version]
      )
    );
}

function buildChartSeriesByMode(baseSeries: ChartData[]): ChartSeriesByMode {
  const normalizedLimit = Math.max(1, VERSIONS_LIMIT);

  return {
    version: applySeriesLimit(baseSeries, normalizedLimit),
    minor: applySeriesLimit(aggregateSeriesBySemver(baseSeries, 'minor'), normalizedLimit),
    major: applySeriesLimit(aggregateSeriesBySemver(baseSeries, 'major'), normalizedLimit),
  };
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

function createVersionChartEntry(
  version: string,
  downloads = 0,
  publishedAt?: string,
  distTags?: string[]
): ChartData {
  return {
    label: version,
    secondaryLabel: getSecondaryChartLabel(version, distTags),
    downloads,
    publishedAt,
    kind: 'version',
    distTags,
    versionCount: 1,
  };
}

function getPrimaryChartLabel({
  label,
  secondaryLabel,
}: Pick<ChartData, 'label' | 'secondaryLabel'>) {
  return secondaryLabel ? label.split('-')[0] : label;
}

function getSecondaryChartLabel(version: string, distTags?: string[]) {
  const [, ...suffixParts] = version.split('-');
  const suffix = suffixParts.join('-');

  return distTags?.length ? distTags.join(', ') : suffix;
}

function aggregateSeriesBySemver(series: ChartData[], mode: AggregatedChartMode) {
  const groups = new Map<string, ChartData>();

  for (const item of series) {
    const aggregateLabel = getAggregatedSemverLabel(item.label, mode);
    const groupKey = aggregateLabel ?? item.label;
    const existing = groups.get(groupKey);

    if (!existing) {
      groups.set(groupKey, {
        label: groupKey,
        secondaryLabel: undefined,
        downloads: item.downloads,
        publishedAt: item.publishedAt,
        kind: aggregateLabel ? mode : 'version',
        versionCount: 1,
      });
      continue;
    }

    groups.set(groupKey, {
      ...existing,
      downloads: existing.downloads + item.downloads,
      publishedAt:
        (item.publishedAt ?? '').localeCompare(existing.publishedAt ?? '') > 0
          ? item.publishedAt
          : existing.publishedAt,
      versionCount: (existing.versionCount ?? 1) + 1,
    });
  }

  return [...groups.values()].sort(compareChartEntries);
}

function applySeriesLimit(series: ChartData[], limit: number) {
  if (series.length <= limit) {
    return [...series].reverse();
  }

  const visibleEntryCount = Math.max(1, limit - 1);
  const visibleSeries = series.slice(0, visibleEntryCount).reverse();
  const hiddenSeries = series.slice(visibleEntryCount);
  const otherDownloads = sumBy(hiddenSeries, item => item.downloads);

  if (!otherDownloads) {
    return visibleSeries;
  }

  return [
    {
      label: OTHER_VERSION_LABEL,
      downloads: otherDownloads,
      kind: 'other' as const,
      versionCount: sumBy(hiddenSeries, item => item.versionCount ?? 1),
    },
    ...visibleSeries,
  ];
}

function compareChartEntries(left: ChartData, right: ChartData) {
  return (
    right.downloads - left.downloads ||
    (right.publishedAt ?? '').localeCompare(left.publishedAt ?? '') ||
    left.label.localeCompare(right.label)
  );
}

function isAggregatedKind(kind: ChartData['kind']): kind is AggregatedChartMode {
  return kind === 'minor' || kind === 'major';
}

function getAggregatedSemverLabel(version: string, mode: AggregatedChartMode) {
  const match = version.match(/^(\d+)\.(\d+)\.\d+(?:[-+].*)?$/);

  if (!match) {
    return undefined;
  }
  return mode === 'major' ? `${match[1]}.x` : `${match[1]}.${match[2]}.x`;
}

function getLargestSeriesLength(chartSeriesByMode: Record<ChartMode, ChartData[]>) {
  return Math.max(...Object.values(chartSeriesByMode).map(series => series.length), 0);
}

function getChartLeftMargin(series: ChartData[]) {
  const widestLabel = Math.max(
    ...series.map(item =>
      Math.max(
        measureTextWidth(getPrimaryChartLabel(item), PRIMARY_LABEL_FONT_SIZE),
        measureTextWidth(item.secondaryLabel ?? '', SECONDARY_LABEL_FONT_SIZE)
      )
    ),
    0
  );

  return clamp(Math.ceil(widestLabel + LABEL_TO_BAR_GAP + 20), MIN_YAXIS_LABEL_WIDTH, 220);
}

function measureTextWidth(text: string, fontSize: number) {
  if (!text || typeof document === 'undefined') {
    return 0;
  }

  const cacheKey = `${fontSize}-${text}`;
  const cachedWidth = YAxisLabelWidthCache.get(cacheKey);

  if (cachedWidth !== undefined) {
    return cachedWidth;
  }

  let tempCanvas = document.querySelector<HTMLCanvasElement>(`#${TEXT_MEASURE_CANVAS_ID}`);

  if (!tempCanvas) {
    tempCanvas = document.createElement('canvas');
    tempCanvas.id = TEXT_MEASURE_CANVAS_ID;
    tempCanvas.style.display = 'none';
    document.body.appendChild(tempCanvas);
  }

  const tempCanvasContext = tempCanvas.getContext('2d');

  if (!tempCanvasContext) {
    return MIN_YAXIS_LABEL_WIDTH;
  }

  tempCanvasContext.font = `${fontSize}px 400 "Optimistic Display", system-ui, sans-serif`;
  const measuredWidth = tempCanvasContext.measureText(text).width;
  YAxisLabelWidthCache.set(cacheKey, measuredWidth);
  return measuredWidth;
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
