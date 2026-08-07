import { orderBy } from 'es-toolkit/array';

import { type LibraryType } from '~/types';

export function issues(libraries: LibraryType[]) {
  return orderBy(libraries, [lib => lib.github.stats.issues], ['desc']);
}

export function stars(libraries: LibraryType[]) {
  return orderBy(libraries, [lib => lib.github.stats.stars], ['desc']);
}

export function downloads(libraries: LibraryType[]) {
  return orderBy(libraries, [lib => lib.npm?.downloads ?? 0], ['desc']);
}

export function updated(libraries: LibraryType[]) {
  return orderBy(libraries, [lib => new Date(lib.github.stats.pushedAt).getTime()], ['desc']);
}

export function released(libraries: LibraryType[]) {
  return orderBy(
    libraries,
    [lib => (lib.npm?.latestReleaseDate ? new Date(lib.npm.latestReleaseDate).getTime() : 0)],
    ['desc']
  );
}

export function quality(libraries: LibraryType[]) {
  return orderBy(libraries, [lib => lib.score], ['desc']);
}

export function popularity(libraries: LibraryType[]) {
  return orderBy(libraries, [lib => lib?.popularity ?? 0], ['desc']);
}

export function relevance(libraries: LibraryType[]) {
  return libraries.sort((a, b) => {
    if (a.matchScore && b.matchScore) {
      if (a.matchScore < 10 || b.matchScore < 10 || Math.abs(a.matchScore - b.matchScore) >= 40) {
        return b.matchScore - a.matchScore;
      }
      return b.score - a.score;
    }
    return 0;
  });
}

export function dependencies(libraries: LibraryType[]) {
  return orderBy(libraries, [lib => lib.github.stats?.dependencies ?? 0], ['desc']);
}

export function bundleSize(libraries: LibraryType[]) {
  return orderBy(libraries, [lib => lib.npm?.size ?? 0], ['desc']);
}
