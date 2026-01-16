import { fetch } from 'bun';

import { fallbackFetchNpmDownloadData } from '~/scripts/fetch-npm-download-data';

import { REQUEST_SLEEP, sleep } from './helpers';

const ATTEMPTS_LIMIT = 2;
const REQUEST_TIMEOUT = 5_000;

export async function fetchNpmStatDataBulk(namesArray: string[], attemptsCount = 0) {
  try {
    const url = urlForPackages(namesArray.join('&package='));

    const response = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    const downloadData = await response.json();

    return await Promise.all(
      namesArray.map(async name => {
        if (response.status >= 500) {
          return {
            name,
            npm: null,
          };
        }

        const pkgData = downloadData[name];

        if (pkgData && Object.keys(pkgData).length > 0) {
          return {
            name,
            npm: formatDownloadData(pkgData),
          };
        }

        console.error(
          `📊 [npm-stat] ${name} doesn't not return downloads data in bulk request, falling back to single query!`
        );

        const singleUrl = urlForPackages(name);

        const singleResponse = await fetch(singleUrl);
        const singleDownloadData = await singleResponse.json();
        const singlePkgData = singleDownloadData[name];

        if (singlePkgData && Object.keys(singlePkgData).length <= 0) {
          console.error(
            `📊 [npm-stat] ${name} doesn't not return downloads data in single request, falling back to npm downloads API!`
          );

          return await fallbackFetchNpmDownloadData(name);
        }

        return {
          name,
          npm: formatDownloadData(singlePkgData),
        };
      })
    );
  } catch (error) {
    if (error instanceof DOMException) {
      console.error(`📊 [npm-stat] ${error.name}: ${error.message} Aborting!`);
      return namesArray.map(name => ({ name, npm: null }));
    }

    if (attemptsCount >= ATTEMPTS_LIMIT) {
      console.error('📊 [npm-stat] Looks like we have reach the npm-stat API rate limit!');
      console.error(error);
      return namesArray.map(name => ({ name, npm: null }));
    }

    await sleep(REQUEST_SLEEP, REQUEST_SLEEP * 2);
    console.log(`📊 [npm-stat] Retrying fetch for ${namesArray.join(', ')} (${attemptsCount + 1})`);

    return await fetchNpmStatDataBulk(namesArray, attemptsCount + 1);
  }
}

function formatDownloadData(downloadData: Record<string, number>) {
  const downloadCounts = Object.values(downloadData);

  return {
    downloads: downloadCounts.reduce((sum, value) => sum + value, 0),
    weekDownloads: downloadCounts.slice(0, 6).reduce((sum, value) => sum + value, 0),
  };
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
