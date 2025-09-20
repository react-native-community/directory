import { fetch } from 'bun';

import { sleep, REQUEST_SLEEP } from './helpers';

const ATTEMPTS_LIMIT = 2;

export async function fetchNpmStatDataBulk(namesArray: string[], attemptsCount = 0) {
  try {
    const url = urlForPackages(namesArray.join('&package='));

    const response = await fetch(url);
    const downloadData = await response.json();

    return namesArray.map(name => {
      const pkgData = downloadData[name];

      if (pkgData && Object.keys(pkgData).length <= 0) {
        console.warn(
          `[npm-stat] ${name} doesn't exist on npm registry, add npmPkg to its entry or remove it!`
        );
        return { npm: null };
      }

      const downloadCountsPerDay = Object.values(pkgData);

      return {
        name,
        npm: {
          downloads: downloadCountsPerDay.reduce((sum: number, value: number) => sum + value, 0),
          weekDownloads: downloadCountsPerDay
            .slice(0, 6)
            .reduce((sum: number, value: number) => sum + value, 0),
        },
      };
    });
  } catch (error) {
    if (attemptsCount >= ATTEMPTS_LIMIT) {
      console.error('[npm-stat] Looks like we have reach the npm-stat API rate limit!');
      console.error(error);
      return namesArray.map(name => ({ name, npm: null }));
    }

    await sleep(REQUEST_SLEEP, REQUEST_SLEEP * 2);
    console.log(`[npm-stat] Retrying fetch for ${namesArray} (${attemptsCount + 1})`);

    return await fetchNpmStatDataBulk(namesArray, attemptsCount + 1);
  }
}

function formattedDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function urlForPackages(packagesList: string) {
  const now = new Date();
  const fromDate = new Date(now);
  fromDate.setMonth(fromDate.getMonth() - 1);

  return `https://npm-stat.com/api/download-counts?package=${packagesList}&from=${formattedDate(fromDate)}&until=${formattedDate(now)}`;
}
