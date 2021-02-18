import fetch from 'cross-fetch';

import { sleep } from './build-and-score-data';

const urlForPackage = npmPkg => {
  return `https://api.npmjs.org/downloads/point/last-month/${npmPkg}`;
};

const fetchNpmData = async (data, npmPkg, githubUrl, attemptsCount = 0) => {
  if (!npmPkg) {
    let parts = githubUrl.split('/');
    npmPkg = parts[parts.length - 1].toLowerCase();
    data.npmPkg = npmPkg;
  }

  try {
    const url = urlForPackage(npmPkg);
    let response = await fetch(url);
    let downloadData = await response.json();

    if (!downloadData.downloads) {
      console.warn(
        `[NPM] ${npmPkg} doesn't exist on npm registry, add npmPkg to its entry or remove it!`
      );
      return { ...data, npm: {} };
    }

    return {
      ...data,
      npm: {
        downloads: downloadData.downloads,
        start: downloadData.start,
        end: downloadData.end,
        period: 'month',
      },
    };
  } catch (e) {
    await sleep(1000 + 1000 * attemptsCount, 2000 + 1000 * attemptsCount);
    console.log(`[NPM] Retrying fetch for ${npmPkg} (${attemptsCount + 1})`);
    return await fetchNpmData(data, npmPkg, githubUrl, attemptsCount + 1);
  }
};

export default fetchNpmData;
