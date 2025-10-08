import { type LibraryType } from '~/types';

export function issues(libraries: LibraryType[]) {
  return libraries.sort((a, b) => b.github.stats.issues - a.github.stats.issues);
}

export function stars(libraries: LibraryType[]) {
  return libraries.sort((a, b) => b.github.stats.stars - a.github.stats.stars);
}

export function downloads(libraries: LibraryType[]) {
  return libraries.sort((a, b) => {
    const bDownloads = b.npm?.downloads ?? 0;
    const aDownloads = a.npm?.downloads ?? 0;

    return bDownloads - aDownloads;
  });
}

export function updated(libraries: LibraryType[]) {
  return libraries.sort((a, b) => {
    return (
      new Date(b.github.stats.pushedAt).getTime() - new Date(a.github.stats.pushedAt).getTime()
    );
  });
}

export function quality(libraries: LibraryType[]) {
  return libraries.sort((a, b) => b.score - a.score);
}

export function popularity(libraries: LibraryType[]) {
  return libraries.sort((a, b) => (b?.popularity ?? 0) - (a?.popularity ?? 0));
}

export function relevance(libraries: LibraryType[]) {
  return libraries.sort((a, b) => {
    if (a.matchScore && b.matchScore) {
      if (Math.abs(a.matchScore - b.matchScore) >= 50) {
        return b.matchScore - a.matchScore;
      }

      return b.score - a.score;
    }
    return 0;
  });
}

export function dependencies(libraries: LibraryType[]) {
  return libraries.sort((a, b) => {
    const bDependencies = b.github.stats?.dependencies ?? 0;
    const aDependencies = a.github.stats?.dependencies ?? 0;

    return bDependencies - aDependencies;
  });
}

export function bundleSize(libraries: LibraryType[]) {
  return libraries.sort((a, b) => {
    const bSize = b.npm?.size ?? 0;
    const aSize = a.npm?.size ?? 0;

    return bSize - aSize;
  });
}
