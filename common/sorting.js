export const approved = (state, libraries, sortBy) => {
  libraries.sort((a, b) => {
    return a.goldstar === b.goldstar ? 0 : a.goldstar ? -1 : 1;
  });

  return { ...state, libraries, sortBy };
};

export const compatibility = (state, libraries, sortBy) => {
  libraries.sort((a, b) => {
    const aCompat = [
      1,
      a.expo,
      a.ios,
      a.android,
      a.web,
    ].reduce((total, val) => {
      return val ? total + val : total;
    });

    const bCompat = [
      1,
      b.expo,
      b.ios,
      b.android,
      b.web,
    ].reduce((total, val) => {
      return val ? total + val : total;
    });

    return bCompat - aCompat;
  });

  return { ...state, libraries, sortBy };
};

export const issues = (state, libraries, sortBy) => {
  libraries.sort((a, b) => {
    return b.github.stats.issues - a.github.stats.issues;
  });

  return { ...state, libraries, sortBy };
};

export const stars = (state, libraries, sortBy) => {
  libraries.sort((a, b) => {
    return b.github.stats.stars - a.github.stats.stars;
  });

  return { ...state, libraries, sortBy };
};

export const downloads = (state, libraries, sortBy) => {
  libraries.sort((a, b) => {
    return b.npm.downloads - a.npm.downloads;
  });

  return { ...state, libraries, sortBy };
};

export const updated = (state, libraries, sortBy) => {
  libraries.sort((a, b) => {
    return (
      new Date(b.github.stats.pushedAt) - new Date(a.github.stats.pushedAt)
    );
  });

  return { ...state, libraries, sortBy };
};

export const health = (state, libraries, sortBy) => {
  libraries.sort((a, b) => {
    return b.score - a.score;
  });

  return { ...state, libraries, sortBy };
};
