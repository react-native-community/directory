import fetch from 'cross-fetch';

import { Library } from '~/types';

export const REQUEST_SLEEP = 5000;

const GRAPHQL_API = 'https://api.github.com/graphql';
const AUTHORIZATION = `bearer ${process.env.CI_CHECKS_TOKEN ?? process.env.GITHUB_TOKEN}`;

export const makeGraphqlQuery = async (query: string, variables = {}) => {
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
};

export const getUpdatedUrl = async url => {
  try {
    const result = await fetch(url);
    return result.url;
  } catch {
    return url;
  }
};

export const parseGitHubUrl = url => {
  const [, , , repoOwner, repoName, ...path] = url.split('/');
  const isMonorepo = !!(path && path.length);
  const packagePath = isMonorepo ? path.slice(2).join('/') : '.';

  return {
    repoOwner,
    repoName,
    isMonorepo,
    packagePath,
  };
};

export function sleep(ms = 0, msMax = null) {
  return new Promise(r =>
    setTimeout(r, msMax ? Math.floor(Math.random() * (msMax - ms)) + ms : ms)
  );
}

export function fillNpmName(library: Library) {
  if (!library.npmPkg) {
    const parts = library.githubUrl.split('/');
    library.npmPkg = parts[parts.length - 1].toLowerCase();
  }
  return library;
}

export function processTopics(topics?: string[]) {
  return (topics ?? [])
    .map(topic =>
      topic
        .replace(/([ _])/g, '-')
        .replace('react-native-', '')
        .toLowerCase()
        .trim()
    )
    .filter(topic => topic?.length);
}

function splitAndGetLastChunk(value: string, delimiter = '/') {
  return value.split(delimiter).at(-1).toLowerCase();
}

export function hasMismatchedPackageData(library: Library) {
  const desiredName = library.npmPkg ?? splitAndGetLastChunk(library.githubUrl);

  if (library.github.registry && library.github.registry !== 'https://registry.npmjs.org/') {
    const registryScope = splitAndGetLastChunk(library.github.registry);
    if (registryScope.startsWith('@')) {
      return library.github?.name.replace(`${registryScope}/`, '') !== desiredName;
    }
  }
  return desiredName !== library.github?.name;
}
