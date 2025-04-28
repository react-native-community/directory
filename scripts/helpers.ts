import { Library } from '../types';

export const REQUEST_SLEEP = 5000;

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
