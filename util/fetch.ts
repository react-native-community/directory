import { type GetServerSidePropsContext, type NextPageContext } from 'next';

import { type Query } from '~/types';
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
