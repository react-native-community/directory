export const recommended = libraries => {
  return libraries.sort((a, b) => {
    return a.goldstar === b.goldstar ? 0 : a.goldstar ? -1 : 1;
  });
};

export const compatibility = libraries => {
  return libraries.sort((a, b) => {
    const aCompat = [1, a.expo && typeof a.expo !== 'string', a.ios, a.android, a.web].reduce(
      (total, val) => {
        return val ? total + val : total;
      }
    );

    const bCompat = [1, b.expo && typeof b.expo !== 'string', b.ios, b.android, b.web].reduce(
      (total, val) => {
        return val ? total + val : total;
      }
    );

    return bCompat - aCompat;
  });
};

export const issues = libraries => {
  return libraries.sort((a, b) => b.github.stats.issues - a.github.stats.issues);
};

export const stars = libraries => {
  return libraries.sort((a, b) => b.github.stats.stars - a.github.stats.stars);
};

export const downloads = libraries => {
  return libraries.sort((a, b) => {
    const bDownloads = b.npm.downloads ? b.npm.downloads : 0;
    const aDownloads = a.npm.downloads ? a.npm.downloads : 0;

    return bDownloads - aDownloads;
  });
};

export const updated = libraries => {
  return libraries.sort((a, b) => {
    return new Date(b.github.stats.pushedAt) - new Date(a.github.stats.pushedAt);
  });
};

export const quality = libraries => {
  return libraries.sort((a, b) => b.score - a.score);
};

export const popularity = libraries => {
  return libraries.sort((a, b) => b.popularity - a.popularity);
};

export const relevance = libraries => {
  return libraries.sort((a, b) => b.matchScore - a.matchScore);
};
