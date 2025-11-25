import { fetch } from 'bun';

import { type LibraryType } from '~/types';

export const REQUEST_SLEEP = 5000;

const GRAPHQL_API = 'https://api.github.com/graphql';
const AUTHORIZATION = `bearer ${process.env.CI_CHECKS_TOKEN ?? process.env.GITHUB_TOKEN}`;

export async function makeGraphqlQuery(query: string, variables = {}) {
  const result = await fetch(GRAPHQL_API, {
    method: 'POST',
    headers: {
      Authorization: AUTHORIZATION,
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  return await result.json();
}

export async function getUpdatedUrl(url: string) {
  try {
    const result = await fetch(url);
    return result.url;
  } catch {
    return url;
  }
}

export function sleep(ms = 0, msMax: number | undefined = undefined) {
  return new Promise(r =>
    setTimeout(r, msMax ? Math.floor(Math.random() * (msMax - ms)) + ms : ms)
  );
}

export function fillNpmName(library: LibraryType) {
  if (!library.npmPkg) {
    const parts = library.githubUrl.split('/');
    library.npmPkg = parts[parts.length - 1].toLowerCase();
  }
  return library;
}

const STOPWORDS = ['react-native', 'reactnative', 'react', 'native'];
const STOPWORDS_PATTERN = new RegExp(`\\b(?:${STOPWORDS.join('|')})\\b`, 'gi');

export function processTopics(topics?: string[]) {
  if (!Array.isArray(topics)) {
    return [];
  }

  return topics
    .map(topic =>
      topic
        .normalize('NFKC')
        .toLowerCase()
        .replace(/([ _])/g, '-')
        .replace(STOPWORDS_PATTERN, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .trim()
    )
    .filter(topic => topic?.length);
}

function splitAndGetLastChunk(value: string, delimiter = '/') {
  return value.split(delimiter).at(-1)?.toLowerCase();
}

export function hasMismatchedPackageData(library: LibraryType) {
  const desiredName = library.npmPkg ?? splitAndGetLastChunk(library.githubUrl);

  if (library.github.registry && library.github.registry !== 'https://registry.npmjs.org/') {
    const registryScope = splitAndGetLastChunk(library.github.registry);
    if (registryScope?.startsWith('@')) {
      return library.github?.name.replace(`${registryScope}/`, '') !== desiredName;
    }
  }
  return desiredName !== library.github?.name;
}
