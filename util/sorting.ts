import { LibraryType } from '~/types';

export function compatibility(libraries: LibraryType[]) {
  return libraries.sort((a, b) => {
    const aCompat = [a.expoGo, a.ios, a.android, a.web]
      .map(value => Number(value))
      .reduce((total, val) => {
        return val ? total + val : total;
      }, 0);

    const bCompat = [b.expoGo, b.ios, b.android, b.web]
      .map(value => Number(value))
      .reduce((total, val) => {
        return val ? total + val : total;
      }, 0);

    return bCompat - aCompat;
  });
}

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
    if (Math.abs(a.matchScore - b.matchScore) >= 50) {
      return b.matchScore - a.matchScore;
    }

    return b.score - a.score;
  });
}
