import { fetch } from 'bun';

import { type LibraryType } from '~/types';

import { sleep, REQUEST_SLEEP } from './helpers';

const ATTEMPTS_LIMIT = 2;

function urlForPackage(npmPkg: string, period = 'month') {
  return `https://api.npmjs.org/downloads/point/last-${period}/${npmPkg}`;
}

export async function fetchNpmDownloadData(pkgData: LibraryType, attemptsCount = 0) {
  const { npmPkg } = pkgData;

  try {
    const url = urlForPackage(npmPkg);
    const response = await fetch(url);
    const downloadData = await response.json();

    if (!downloadData.package) {
      console.warn(
        `[NPM DOWNLOADS API] ${npmPkg} doesn't exist on npm registry, add npmPkg to its entry or remove it!`
      );
      return { ...pkgData, npm: null };
    }

    return {
      ...pkgData,
      npm: {
        downloads: downloadData.downloads,
      },
    };
  } catch (error) {
    if (attemptsCount >= ATTEMPTS_LIMIT) {
      console.error('[NPM DOWNLOADS API] Looks like we have reach the NPM API rate limit!');
      console.error(error);
      return { ...pkgData, npm: null };
    }
    await sleep(REQUEST_SLEEP, REQUEST_SLEEP * 2);
    console.log(`[NPM DOWNLOADS API] Retrying fetch for ${npmPkg} (${attemptsCount + 1})`);
    return await fetchNpmDownloadData(pkgData, attemptsCount + 1);
  }
}

export async function fallbackFetchNpmDownloadData(name: string) {
  try {
    const monthlyUrl = urlForPackage(name);
    const monthlyResponse = await fetch(monthlyUrl);
    const monthlyDownloadData = await monthlyResponse.json();

    if (!monthlyDownloadData.package) {
      console.warn(
        `[NPM DOWNLOADS API] ${name} doesn't exist on npm registry, add npmPkg to its entry or remove it!`
      );
      return { name, npm: null };
    }

    const weeklyUrl = urlForPackage(name);
    const weeklyResponse = await fetch(weeklyUrl);
    const weeklyDownloadData = await weeklyResponse.json();

    if (!weeklyDownloadData.package) {
      console.warn(
        `[NPM DOWNLOADS API] ${name} doesn't exist on npm registry, add npmPkg to its entry or remove it!`
      );
      return { name, npm: null };
    }

    return {
      name,
      npm: {
        downloads: monthlyDownloadData.downloads as number,
        weekDownloads: weeklyDownloadData.downloads as number,
      },
    };
  } catch (error) {
    console.error('[NPM DOWNLOADS API] Looks like we have reach the NPM API rate limit!');
    console.error(error);
    return { name, npm: null };
  }
}
