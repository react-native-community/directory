import { type Query } from '~/types';

function toQueryString(query: Query) {
  return new URLSearchParams(query as Record<string, string>).toString();
}

export default function urlWithQuery(url: string, query: Partial<Query>): string {
  const queryString = toQueryString(
    Object.fromEntries(Object.entries(query).filter(([, v]) => Boolean(v)))
  );
  return queryString ? `${url}?${queryString}` : url;
}
