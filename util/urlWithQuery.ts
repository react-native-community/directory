import { Query } from '../types';

function toQueryString(query: Query) {
  return new URLSearchParams(query as Record<string, string>).toString();
}

export default function urlWithQuery(url: string, query: Query) {
  const queryWithoutEmptyParams = {};
  Object.keys(query).forEach(key => {
    if (query[key]) {
      queryWithoutEmptyParams[key] = query[key];
    }
  });
  if (Object.keys(queryWithoutEmptyParams).length === 0) {
    return url;
  } else {
    return `${url}?${toQueryString(queryWithoutEmptyParams)}`;
  }
}
