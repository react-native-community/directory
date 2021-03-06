import fetch from 'cross-fetch';

import { sleep } from './build-and-score-data';

const urlForPackage = (npmPkg, period = 'month') => {
  return `https://api.npmjs.org/downloads/point/last-${period}/${npmPkg}`;
};

export const fetchNpmDataBulk = async (data, npmPkgs, attemptsCount = 0) => {
  try {
    const url = urlForPackage(npmPkgs.join(','));
    let response = await fetch(url);
    let downloadData = await response.json();

    return npmPkgs.map(pkg => {
      if (!downloadData[pkg].downloads) {
        console.warn(
          `[NPM] ${pkg} doesn't exist on npm registry, add npmPkg to its entry or remove it!`
        );
        return { npm: null };
      }

      return {
        pkgName: pkg,
        npm: {
          downloads: downloadData[pkg].downloads,
          start: downloadData[pkg].start,
          end: downloadData[pkg].end,
          period: 'month',
        },
      };
    });
  } catch (e) {
    await sleep(1000 + 250 * attemptsCount, 2000 + 500 * attemptsCount);
    console.log(`[NPM] Retrying fetch for ${npmPkgs} (${attemptsCount + 1})`);
    return await fetchNpmDataBulk(data, npmPkgs, attemptsCount + 1);
  }
};

export const fetchNpmData = async (data, npmPkg, attemptsCount = 0) => {
  try {
    const url = urlForPackage(npmPkg);
    let response = await fetch(url);
    let downloadData = await response.json();

    if (!downloadData.downloads) {
      console.warn(
        `[NPM] ${npmPkg} doesn't exist on npm registry, add npmPkg to its entry or remove it!`
      );
      return { ...data, npm: null };
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
    await sleep(1000 + 250 * attemptsCount, 2000 + 500 * attemptsCount);
    console.log(`[NPM] Retrying fetch for ${npmPkg} (${attemptsCount + 1})`);
    return await fetchNpmData(data, npmPkg, attemptsCount + 1);
  }
};
