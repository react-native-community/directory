import fetch from 'cross-fetch';

import { sleep } from './helpers.js';

const urlForPackage = (npmPkg, period = 'month') => {
  return `https://api.npmjs.org/downloads/point/last-${period}/${npmPkg}`;
};

export const fetchNpmDataBulk = async (namesArray, period = 'month', attemptsCount = 0) => {
  try {
    const listCount = namesArray.length;
    const url = urlForPackage(namesArray.join(','), period);

    const isMonthly = period === 'month';
    const response = await fetch(url);
    const downloadData = await response.json();

    return namesArray.map(name => {
      const pkgData = listCount === 1 ? downloadData : downloadData[name];

      if (isMonthly && !pkgData?.downloads) {
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
              weekDownloads: pkgData?.downloads || 0,
            },
      };
    });
  } catch {
    if (attemptsCount > 25) {
      console.error('[NPM] Looks like we have reach the NPM API rate limit!');
      return namesArray.map(name => ({ name, npm: null }));
    }
    await sleep(2500 + 500 * attemptsCount, 5000 + 500 * attemptsCount);
    console.log(`[NPM] Retrying fetch for ${namesArray} (${attemptsCount + 1})`);
    return await fetchNpmDataBulk(namesArray, period, attemptsCount + 1);
  }
};

export const fetchNpmData = async (pkgData, attemptsCount = 0) => {
  const { npmPkg } = pkgData;

  try {
    const url = urlForPackage(npmPkg);
    const response = await fetch(url);
    const downloadData = await response.json();

    if (!downloadData.package) {
      console.warn(
        `[NPM] ${npmPkg} doesn't exist on npm registry, add npmPkg to its entry or remove it!`
      );
      return { ...pkgData, npm: null };
    }

    const weekUrl = urlForPackage(npmPkg, 'week');
    const weekResponse = await fetch(weekUrl);
    const weekDownloadData = await weekResponse.json();

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
  } catch {
    if (attemptsCount > 25) {
      console.error('[NPM] Looks like we have reach the NPM API rate limit!');
      return { ...pkgData, npm: null };
    }
    await sleep(2500 + 500 * attemptsCount, 5000 + 500 * attemptsCount);
    console.log(`[NPM] Retrying fetch for ${npmPkg} (${attemptsCount + 1})`);
    return await fetchNpmData(pkgData, attemptsCount + 1);
  }
};
