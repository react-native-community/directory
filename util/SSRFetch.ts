import { type NextPageContext } from 'next';

import { type Query } from '~/types';
import { NEXT_1H_CACHE_HEADER } from '~/util/Constants';
import getApiUrl from '~/util/getApiUrl';
import urlWithQuery from '~/util/urlWithQuery';

export async function ssrFetch(
  url: string,
  query: Partial<Query>,
  ctx: NextPageContext
): Promise<Response> {
  return await fetch(getApiUrl(urlWithQuery(url, query), ctx), NEXT_1H_CACHE_HEADER);
}
