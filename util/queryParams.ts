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

export function replaceQueryParam(router: NextRouter, paramName: string, paramValue?: string) {
  const queryParams = omit(router.query, [paramName]);

  void router.replace(
    {
      pathname: router.pathname,
      query: paramValue ? { ...queryParams, [paramName]: paramValue } : queryParams,
    },
    undefined,
    {
      shallow: true,
      scroll: false,
    }
  );
}
