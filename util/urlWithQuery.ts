function toQueryString(query: { [key: string]: any }) {
  return new URLSearchParams(query).toString();
}

export default function urlWithQuery(url, query) {
  let queryWithoutEmptyParams = {};
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
