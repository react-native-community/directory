import { type NextApiRequest, type NextApiResponse } from 'next';

import data from '~/assets/data.json';
import { type DataAssetType, type StatisticBucketType, type StatisticResultType } from '~/types';
import { DEFAULT_RESPONSE_CACHE_HEADER } from '~/util/Constants';
import { getNewArchSupportStatus, NewArchSupportStatus } from '~/util/newArchStatus';

const DATASET = data as DataAssetType;

const SCORE_BUCKET_LABELS = Array.from({ length: 10 }, (_, index) => {
  const lower = index * 10;
  return `${lower}-${lower + 10}`;
});

const DEPENDENCY_BUCKETS = [
  { label: '0', min: 0, max: 0 },
  { label: '1-5', min: 1, max: 5 },
  { label: '6-10', min: 6, max: 10 },
  { label: '11-25', min: 11, max: 25 },
  { label: '26-49', min: 26, max: 49 },
  { label: '50+', min: 50, max: Number.POSITIVE_INFINITY },
];
const BUNDLE_SIZE_BUCKETS = [
  { label: '<100 kB', min: 0, max: 99_999 },
  { label: '100-500 kB', min: 100_000, max: 499_999 },
  { label: '500 kB-1 MB', min: 500_000, max: 999_999 },
  { label: '1-5 MB', min: 1_000_000, max: 4_999_999 },
  { label: '5-10 MB', min: 5_000_000, max: 9_999_999 },
  { label: '10+ MB', min: 10_000_000, max: Number.POSITIVE_INFINITY },
];

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  const result: StatisticResultType = {
    total: 0,
    newArchitecture: 0,
    downloads: 0,
    weekDownloads: 0,
    unmaintained: 0,
    withTypes: 0,
    withNativeCode: 0,
    withConfigPlugin: 0,
    ios: 0,
    android: 0,
    web: 0,
    expoGo: 0,
    windows: 0,
    macos: 0,
    fireos: 0,
    harmony: 0,
    horizon: 0,
    tvos: 0,
    visionos: 0,
    vegaos: 0,
    packageManager: {
      bun: 0,
      pnpm: 0,
      npm: 0,
      yarn: 0,
    },
    moduleType: {
      expo: 0,
      nitro: 0,
      turbo: 0,
    },
    lintTools: {
      oxlint: 0,
      oxfmt: 0,
      eslint: 0,
      prettier: 0,
      biome: 0,
      commitlint: 0,
    },
    scoreBuckets: createBuckets(SCORE_BUCKET_LABELS),
    dependencyBuckets: createBuckets([...DEPENDENCY_BUCKETS.map(({ label }) => label), 'Unknown']),
    bundleSizeBuckets: createBuckets([...BUNDLE_SIZE_BUCKETS.map(({ label }) => label), 'Unknown']),
  };

  DATASET.libraries.forEach(library => {
    result.total++;
    const scoreBucketIndex = Math.min(Math.max(Math.floor(library.score / 10), 0), 9);
    result.scoreBuckets[scoreBucketIndex].count++;
    incrementRangeBucket(
      result.dependencyBuckets,
      DEPENDENCY_BUCKETS,
      library.github.stats.dependencies
    );
    incrementRangeBucket(result.bundleSizeBuckets, BUNDLE_SIZE_BUCKETS, library.npm?.size);

    if (
      [NewArchSupportStatus.Supported, NewArchSupportStatus.NewArchOnly].includes(
        getNewArchSupportStatus(library)
      )
    ) {
      result.newArchitecture++;
    }

    if (library.npm?.downloads) {
      result.downloads += library.npm.downloads;
    }

    if (library.npm?.weekDownloads) {
      result.weekDownloads += library.npm.weekDownloads;
    }

    if (library.unmaintained === true) {
      result.unmaintained++;
    }

    if (library.github.hasTypes) {
      result.withTypes++;
    }

    if (library.github.hasNativeCode) {
      result.withNativeCode++;
    }

    if (library.configPlugin || library.github.configPlugin) {
      result.withConfigPlugin++;
    }

    if (library.ios) {
      result.ios++;
    }

    if (library.android) {
      result.android++;
    }

    if (library.web) {
      result.web++;
    }

    if (library.expoGo) {
      result.expoGo++;
    }

    if (library.windows) {
      result.windows++;
    }

    if (library.macos) {
      result.macos++;
    }

    if (library.fireos) {
      result.fireos++;
    }

    if (library.harmony) {
      result.harmony++;
    }

    if (library.horizon) {
      result.horizon++;
    }

    if (library.tvos) {
      result.tvos++;
    }

    if (library.visionos) {
      result.visionos++;
    }

    if (library.vegaos) {
      result.vegaos++;
    }

    library.github.lintTools?.forEach(tool => {
      result.lintTools[tool]++;
    });

    if (library.github.moduleType) {
      if (library.github.moduleType === 'expo') {
        result.moduleType.expo++;
      } else if (library.github.moduleType === 'nitro') {
        result.moduleType.nitro++;
      } else if (library.github.moduleType === 'turbo') {
        result.moduleType.turbo++;
      }
    }

    if (library.github.packageManager) {
      if (library.github.packageManager.includes('bun')) {
        result.packageManager.bun++;
      } else if (library.github.packageManager.includes('pnpm')) {
        result.packageManager.pnpm++;
      } else if (library.github.packageManager.includes('npm')) {
        result.packageManager.npm++;
      } else if (library.github.packageManager.includes('yarn')) {
        result.packageManager.yarn++;
      }
    }
  });

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', DEFAULT_RESPONSE_CACHE_HEADER);
  res.statusCode = 200;

  res.json(result);
}

function createBuckets(labels: string[]): StatisticBucketType[] {
  return labels.map(label => ({ label, count: 0 }));
}

function incrementRangeBucket(
  buckets: StatisticBucketType[],
  ranges: { label: string; min: number; max: number }[],
  value?: number
) {
  const rangeIndex =
    typeof value === 'number' && Number.isFinite(value)
      ? ranges.findIndex(range => value >= range.min && value <= range.max)
      : -1;
  const bucketIndex = rangeIndex === -1 ? buckets.length - 1 : rangeIndex;

  buckets[bucketIndex].count++;
}
