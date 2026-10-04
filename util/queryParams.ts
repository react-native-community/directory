import { omit } from 'es-toolkit/object';
import { type NextRouter } from 'next/router';

export function parseQueryParams(params: Partial<Record<string, string | string[]>>) {
  return Object.fromEntries(
    Object.entries(params).map(([key, val]) => [
      key,
      Array.isArray(val) ? val[0]?.trim() : val?.trim(),
    ])
  );
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
