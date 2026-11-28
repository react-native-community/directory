import { type GetServerSidePropsContext, type NextPageContext } from 'next';

import { type LibraryType, type Query } from '~/types';
import { NEXT_1H_CACHE_HEADER } from '~/util/Constants';
import getApiUrl from '~/util/getApiUrl';
import urlWithQuery from '~/util/urlWithQuery';

export async function ssrFetch(
  url: string,
  query: Partial<Query>,
  ctx: NextPageContext | GetServerSidePropsContext
): Promise<Response> {
  return await fetch(getApiUrl(urlWithQuery(url, query), ctx), NEXT_1H_CACHE_HEADER);
}

/**
 * Fetch the directory entry for the package page by exact package name. Using search results
 * for this is not reliable, because exact name match is not guaranteed to be in the first page.
 */
export async function ssrFetchPackageData(
  packageName: string,
  ctx: NextPageContext | GetServerSidePropsContext
): Promise<{ status: number; apiData: { libraries: LibraryType[] } }> {
  const response = await fetch(
    getApiUrl(`/library?${new URLSearchParams({ name: packageName }).toString()}`, ctx),
    NEXT_1H_CACHE_HEADER
  );

  if (response.status !== 200) {
    return { status: response.status, apiData: { libraries: [] } };
  }

  const data: Record<string, LibraryType> = await response.json();

  return { status: response.status, apiData: { libraries: Object.values(data) } };
}

export function swrJSONFetch(url: string) {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    return response.json();
  });
}

export function swrTextFetch(url: string) {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch file from ${url}: ${response.status}`);
    }
    return response.text();
  });
}
