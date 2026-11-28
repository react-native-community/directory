import { omit } from 'es-toolkit/object';
import { type NextRouter } from 'next/router';

import { type Query } from '~/types';

const DIRECTORY_QUERY_PARAMS = new Set(
  Object.keys({
    android: true,
    expoGo: true,
    ios: true,
    macos: true,
    fireos: true,
    tvos: true,
    visionos: true,
    vegaos: true,
    horizon: true,
    harmony: true,
    web: true,
    windows: true,
    dev: true,
    order: true,
    direction: true,
    search: true,
    offset: true,
    limit: true,
    hasExample: true,
    hasImage: true,
    hasTypes: true,
    hasSwiftPM: true,
    hasNativeCode: true,
    configPlugin: true,
    isMaintained: true,
    isPopular: true,
    wasRecentlyUpdated: true,
    minPopularity: true,
    minMonthlyDownloads: true,
    newArchitecture: true,
    skipLibs: true,
    skipTools: true,
    expoModule: true,
    nitroModule: true,
    turboModule: true,
    nightlyProgram: true,
    owner: true,
    dependantsOf: true,
    bookmarks: true,
  } satisfies Record<keyof Query, true>)
);

export function parseQueryParams(params: Partial<Record<string, string | string[]>>) {
  return Object.fromEntries(
    Object.entries(params).map(([key, val]) => [
      key,
      Array.isArray(val) ? val[0]?.trim() : val?.trim(),
    ])
  );
}

/**
 * Check if the query contains any of the directory search, filter, or sort params.
 * Other params, like `utm_source` or `fbclid`, are ignored.
 */
export function hasDirectoryQueryParams(params: Partial<Record<string, unknown>>) {
  return Object.keys(params).some(key => DIRECTORY_QUERY_PARAMS.has(key));
}

type QueryParams = Record<string, string | undefined>;

export function replaceQueryParams(router: NextRouter, params: QueryParams) {
  const queryParams = omit(router.query, Object.keys(params));
  const filteredParams = Object.entries(params).filter(([, value]) => Boolean(value));
  const nextParams = Object.fromEntries(filteredParams);

  void router.replace(
    {
      pathname: router.pathname,
      query: { ...queryParams, ...nextParams },
    },
    undefined,
    {
      shallow: true,
      scroll: false,
    }
  );
}
