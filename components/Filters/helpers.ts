import { type Query } from '~/types';

type FilterParamsType = {
  param: keyof Query;
  title: string;
};

export const FILTER_PLATFORMS: FilterParamsType[] = [
  {
    param: 'android',
    title: 'Android',
  },
  {
    param: 'ios',
    title: 'iOS',
  },
  {
    param: 'macos',
    title: 'macOS',
  },
  {
    param: 'tvos',
    title: 'tvOS',
  },
  {
    param: 'visionos',
    title: 'visionOS',
  },
  {
    param: 'web',
    title: 'Web',
  },
  {
    param: 'windows',
    title: 'Windows',
  },
];

export const FILTER_REQUIRES_MAIN_SEARCH: FilterParamsType[] = [
  {
    param: 'isMaintained',
    title: 'Maintained',
  },
  {
    param: 'isPopular',
    title: 'Popular',
  },
];

export const FILTER_STATUS: FilterParamsType[] = [
  {
    param: 'newArchitecture',
    title: 'Supports New Architecture',
  },
  {
    param: 'hasNativeCode',
    title: 'Uses native code',
  },
  {
    param: 'configPlugin',
    title: 'Has Expo config plugin',
  },
  {
    param: 'hasExample',
    title: 'Has example',
  },
  {
    param: 'hasImage',
    title: 'Has image preview',
  },
  {
    param: 'hasTypes',
    title: 'Has TypeScript types',
  },
  {
    param: 'wasRecentlyUpdated',
    title: 'Recently updated',
  },
];

export const FILTER_COMPATIBILITY: FilterParamsType[] = [
  {
    param: 'expoGo',
    title: 'Works with Expo Go',
  },
  {
    param: 'fireos',
    title: 'Works with Fire OS',
  },
  {
    param: 'vegaos',
    title: 'Works with Vega OS',
  },
];

export const FILTER_TYPE: FilterParamsType[] = [
  {
    param: 'skipLibs',
    title: 'Hide libraries',
  },
  {
    param: 'skipTools',
    title: 'Hide development tools',
  },
  {
    param: 'skipTemplates',
    title: 'Hide templates',
  },
];

export const FILTER_MODULE_TYPE: FilterParamsType[] = [
  {
    param: 'expoModule',
    title: 'Expo Module',
  },
  {
    param: 'nitroModule',
    title: 'Nitro Module',
  },
  {
    param: 'turboModule',
    title: 'Turbo Module',
  },
];
