import fetch from 'cross-fetch';

import { sleep } from './build-and-score-data';

const urlForPackage = (npmPkg, period = 'month') => {
  return `https://api.npmjs.org/downloads/point/last-${period}/${npmPkg}`;
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

    const weekUrl = urlForPackage(npmPkg, 'week');
    let weekResponse = await fetch(weekUrl);
    let weekDownloadData = await weekResponse.json();

    return {
      ...data,
      npm: {
        downloads: downloadData.downloads,
        weekDownloads: weekDownloadData.downloads,
        start: downloadData.start,
        end: downloadData.end,
        period: 'month',
      },
    };
  } catch (e) {
    await sleep(1000 + 250 * attemptsCount, 2000 + 500 * attemptsCount);
    console.log(`[NPM] Retrying fetch for ${npmPkg} (${attemptsCount + 1})`);
    return await fetchNpmData(data, npmPkg, githubUrl, attemptsCount + 1);
  }
};

export default fetchNpmData;
