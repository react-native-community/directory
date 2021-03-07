import fetch from 'cross-fetch';

import { sleep } from './build-and-score-data';

const urlForPackage = (npmPkg, period = 'month') => {
  return `https://api.npmjs.org/downloads/point/last-${period}/${npmPkg}`;
};

export const fetchNpmDataBulk = async (namesArray, period = 'month', attemptsCount = 0) => {
  try {
    const url = urlForPackage(namesArray.join(','), period);
    const isMonthly = period === 'month';
    const response = await fetch(url);
    const downloadData = await response.json();

    return namesArray.map(name => {
      const pkgData = downloadData[name];

      if (isMonthly && !pkgData.downloads) {
        console.warn(
          `[NPM] ${name} doesn't exist on npm registry, add npmPkg to its entry or remove it!`
        );
        return { npm: null };
      }

      return {
        name,
        npm: isMonthly
          ? {
              downloads: pkgData.downloads,
              start: pkgData.start,
              end: pkgData.end,
              period,
            }
          : {
              weekDownloads: pkgData.downloads || 0,
            },
      };
    });
  } catch (e) {
    await sleep(1000 + 250 * attemptsCount, 2000 + 500 * attemptsCount);
    console.log(`[NPM] Retrying fetch for ${namesArray} (${attemptsCount + 1})`);
    return await fetchNpmDataBulk(namesArray, period, attemptsCount + 1);
  }
};

export const fetchNpmData = async (pkgData, attemptsCount = 0) => {
  const { npmPkg } = pkgData;

  try {
    const url = urlForPackage(npmPkg);
    let response = await fetch(url);
    let downloadData = await response.json();

    if (!downloadData.downloads) {
      console.warn(
        `[NPM] ${npmPkg} doesn't exist on npm registry, add npmPkg to its entry or remove it!`
      );
      return { ...pkgData, npm: null };
    }

    const weekUrl = urlForPackage(npmPkg, 'week');
    let weekResponse = await fetch(weekUrl);
    let weekDownloadData = await weekResponse.json();

    return {
      ...pkgData,
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
    return await fetchNpmData(pkgData, attemptsCount + 1);
  }
};
