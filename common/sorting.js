export const recommended = libraries => {
  libraries.sort((a, b) => {
    return a.goldstar === b.goldstar ? 0 : a.goldstar ? -1 : 1;
  });

  return libraries;
};

export const compatibility = libraries => {
  libraries.sort((a, b) => {
    const aCompat = [
      1,
      a.expo && typeof a.expo !== 'string',
      a.ios,
      a.android,
      a.web,
    ].reduce((total, val) => {
      return val ? total + val : total;
    });

    const bCompat = [
      1,
      b.expo && typeof b.expo !== 'string',
      b.ios,
      b.android,
      b.web,
    ].reduce((total, val) => {
      return val ? total + val : total;
    });

    return bCompat - aCompat;
  });

  return libraries;
};

export const issues = libraries => {
  libraries.sort((a, b) => {
    return b.github.stats.issues - a.github.stats.issues;
  });

  return libraries;
};

export const stars = libraries => {
  libraries.sort((a, b) => {
    return b.github.stats.stars - a.github.stats.stars;
  });

  return libraries;
};

export const downloads = libraries => {
  libraries.sort((a, b) => {
    let bDownloads = b.npm.downloads ? b.npm.downloads : 0;
    let aDownloads = a.npm.downloads ? a.npm.downloads : 0;

    return bDownloads - aDownloads;
  });

  return libraries;
};

export const updated = libraries => {
  libraries.sort((a, b) => {
    return new Date(b.github.stats.pushedAt) - new Date(a.github.stats.pushedAt);
  });

  return libraries;
};

export const quality = libraries => {
  libraries.sort((a, b) => {
    return b.score - a.score;
  });

  return libraries;
};
