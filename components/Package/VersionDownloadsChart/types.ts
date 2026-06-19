export type VersionsChartMode = 'version' | 'minor' | 'major';
export type VersionsAggregatedChartMode = Exclude<VersionsChartMode, 'version'>;
export type VersionsChartEntryKind = VersionsChartMode | 'other';

export type VersionsChartData = {
  label: string;
  secondaryLabel?: string;
  downloads: number;
  publishedAt?: string;
  kind: VersionsChartEntryKind;
  distTags?: string[];
  versionCount?: number;
};

export type VersionsChartSeriesByMode = Record<VersionsChartMode, VersionsChartData[]>;
