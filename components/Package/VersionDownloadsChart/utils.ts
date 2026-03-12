import { clamp, sumBy } from 'es-toolkit/math';

import { type NpmPerVersionDownloads, type NpmRegistryData } from '~/types';

import {
  type AggregatedChartMode,
  type ChartData,
  type ChartMode,
  type ChartSeriesByMode,
} from './types';

export const CHART_MODE_QUERY_PARAM = 'chartMode';
export const CHART_MODES = ['version', 'minor', 'major'] as const;
export const DEFAULT_CHART_MODE: ChartMode = 'version';
export const LABEL_TO_BAR_GAP = 6;

const VERSIONS_LIMIT = 12;
const MIN_YAXIS_LABEL_WIDTH = 72;
const OTHER_VERSION_LABEL = 'Other';
const TEXT_MEASURE_CANVAS_ID = 'measure-canvas';
const Y_AXIS_LABEL_WIDTH_CACHE = new Map<string, number>();

export function isValidChartMode(value?: string | string[]): value is ChartMode {
  return typeof value === 'string' && CHART_MODES.includes(value as ChartMode);
}

export function parseChartMode(value?: string | string[]) {
  return isValidChartMode(value) ? value : DEFAULT_CHART_MODE;
}

export function buildBaseChartSeries(
  npmDownloads: NpmPerVersionDownloads,
  registryData: NpmRegistryData,
  versionDistTags: Record<string, string[]>
) {
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

export function buildChartSeriesByMode(baseSeries: ChartData[]): ChartSeriesByMode {
  return {
    version: applySeriesLimit(baseSeries, VERSIONS_LIMIT),
    minor: applySeriesLimit(aggregateSeriesBySemver(baseSeries, 'minor'), VERSIONS_LIMIT),
    major: applySeriesLimit(aggregateSeriesBySemver(baseSeries, 'major'), VERSIONS_LIMIT),
  };
}

export function createVersionChartEntry(
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

export function getPrimaryChartLabel({ label, secondaryLabel }: ChartData) {
  return secondaryLabel ? label.split('-')[0] : label;
}

export function getLargestSeriesLength(chartSeriesByMode: ChartSeriesByMode) {
  return Math.max(...Object.values(chartSeriesByMode).map(series => series.length), 0);
}

export function mapVersionDistTags(registryData: NpmRegistryData) {
  return Object.entries(registryData['dist-tags']).reduce<Record<string, string[]>>(
    (acc, [tag, version]) => {
      acc[version] = [...(acc[version] ?? []), tag];
      return acc;
    },
    {}
  );
}

function getSecondaryChartLabel(version: string, distTags?: string[]) {
  if (distTags?.length) {
    return distTags.join(', ');
  }

  return version.split('-').slice(1).join('-');
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
      publishedAt: getLatestPublishedAt(existing.publishedAt, item.publishedAt),
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

function getLatestPublishedAt(left?: string, right?: string) {
  return (right ?? '').localeCompare(left ?? '') > 0 ? right : left;
}

function getAggregatedSemverLabel(version: string, mode: AggregatedChartMode) {
  const match = version.match(/^(\d+)\.(\d+)\.\d+(?:[-+].*)?$/);

  if (!match) {
    return undefined;
  }

  return mode === 'major' ? `${match[1]}.x` : `${match[1]}.${match[2]}.x`;
}

export function getChartLeftMargin(series: ChartData[]) {
  const widestLabel = Math.max(
    ...series.map(item =>
      Math.max(
        measureTextWidth(getPrimaryChartLabel(item), 12),
        measureTextWidth(item.secondaryLabel ?? '', 10)
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
  const cachedWidth = Y_AXIS_LABEL_WIDTH_CACHE.get(cacheKey);

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
  Y_AXIS_LABEL_WIDTH_CACHE.set(cacheKey, measuredWidth);
  return measuredWidth;
}
