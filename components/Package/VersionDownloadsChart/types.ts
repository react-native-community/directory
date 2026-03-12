export type ChartMode = 'version' | 'minor' | 'major';
export type AggregatedChartMode = Exclude<ChartMode, 'version'>;
export type ChartEntryKind = ChartMode | 'other';

export type ChartData = {
  label: string;
  secondaryLabel?: string;
  downloads: number;
  publishedAt?: string;
  kind: ChartEntryKind;
  distTags?: string[];
  versionCount?: number;
};

export type ChartSeriesByMode = Record<ChartMode, ChartData[]>;
