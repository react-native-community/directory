import { TimeRange } from '~/util/datetime';

export const NUM_PER_PAGE = 30;

export const EMPTY_PACKAGE_DATA = {
  props: {},
};

export const VALID_ENTRY_KEYS = new Set([
  'githubUrl',
  'ios',
  'android',
  'web',
  'expoGo',
  'windows',
  'macos',
  'fireos',
  'horizon',
  'tvos',
  'visionos',
  'vegaos',
  'unmaintained',
  'dev',
  'template',
  'newArchitecture',
  'newArchitectureNote',
  'configPlugin',
  'alternatives',
  'npmPkg',
  'examples',
  'images',
]);

export const NEXT_10M_CACHE_HEADER = {
  next: { revalidate: TimeRange.MINUTE * 10 },
};

export const NEXT_1H_CACHE_HEADER = {
  next: { revalidate: TimeRange.HOUR },
};
