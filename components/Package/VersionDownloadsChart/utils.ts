import { groupBy } from 'es-toolkit/array';
import { clamp, sumBy } from 'es-toolkit/math';
import { mapValues } from 'es-toolkit/object';

import { type NpmPerVersionDownloads, type PackageVersionsData } from '~/types';

import {
  type VersionsAggregatedChartMode,
  type VersionsChartData,
  type VersionsChartMode,
  type VersionsChartSeriesByMode,
} from './types';

export const CHART_MODE_QUERY_PARAM = 'chartMode';
export const CHART_MODES = ['version', 'minor', 'major'] as const;
export const DEFAULT_CHART_MODE: VersionsChartMode = 'version';
export const LABEL_TO_BAR_GAP = 6;

const VERSIONS_LIMIT = 12;
const MIN_YAXIS_LABEL_WIDTH = 72;
const OTHER_VERSION_LABEL = 'Other';
const TEXT_MEASURE_CANVAS_ID = 'measure-canvas';
const Y_AXIS_LABEL_WIDTH_CACHE = new Map<string, number>();

export function isValidChartMode(value?: string | string[]): value is VersionsChartMode {
  return typeof value === 'string' && CHART_MODES.includes(value as VersionsChartMode);
}

export function parseChartMode(value?: string | string[]) {
  return isValidChartMode(value) ? value : DEFAULT_CHART_MODE;
}

export function buildBaseChartSeries(
  npmDownloads: NpmPerVersionDownloads,
  registryData: PackageVersionsData,
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

export function buildChartSeriesByMode(baseSeries: VersionsChartData[]): VersionsChartSeriesByMode {
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
): VersionsChartData {
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

export function getPrimaryChartLabel({ label, secondaryLabel }: VersionsChartData) {
  return secondaryLabel ? label.split('-')[0] : label;
}

export function getLargestSeriesLength(chartSeriesByMode: VersionsChartSeriesByMode) {
  return Math.max(...Object.values(chartSeriesByMode).map(series => series.length), 0);
}

export function mapVersionDistTags(registryData: PackageVersionsData) {
  const tagsByVersion = groupBy(
    Object.entries(registryData['dist-tags']),
    ([, version]) => version
  );

  return mapValues(tagsByVersion, tags => tags.map(([tag]) => tag));
}

function getSecondaryChartLabel(version: string, distTags?: string[]) {
  if (distTags?.length) {
    return distTags.join(', ');
  }

  return version.split('-').slice(1).join('-');
}

function aggregateSeriesBySemver(series: VersionsChartData[], mode: VersionsAggregatedChartMode) {
  const groups = new Map<string, VersionsChartData>();

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

function applySeriesLimit(series: VersionsChartData[], limit: number) {
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

function compareChartEntries(left: VersionsChartData, right: VersionsChartData) {
  return (
    right.downloads - left.downloads ||
    (right.publishedAt ?? '').localeCompare(left.publishedAt ?? '') ||
    left.label.localeCompare(right.label)
  );
}

function getLatestPublishedAt(left?: string, right?: string) {
  return (right ?? '').localeCompare(left ?? '') > 0 ? right : left;
}

function getAggregatedSemverLabel(version: string, mode: VersionsAggregatedChartMode) {
  const match = version.match(/^(\d+)\.(\d+)\.\d+(?:[-+].*)?$/);

  if (!match) {
    return undefined;
  }

  return mode === 'major' ? `${match[1]}.x` : `${match[1]}.${match[2]}.x`;
}

export function getChartLeftMargin(series: VersionsChartData[]) {
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
