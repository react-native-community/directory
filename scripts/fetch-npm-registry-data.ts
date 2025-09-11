import fetch from 'cross-fetch';

import { LibraryType } from '~/types';

import { sleep, REQUEST_SLEEP } from './helpers';

const ATTEMPTS_LIMIT = 2;

function urlForPackage(npmPkg: string) {
  return `https://registry.npmjs.org/${npmPkg}`;
}

export async function fetchNpmRegistryData(pkgData: LibraryType, attemptsCount = 0) {
  const { npmPkg } = pkgData;

  try {
    const url = urlForPackage(npmPkg);
    const response = await fetch(url);
    const registryData = await response.json();

    if (!registryData._id) {
      console.warn(
        `[NPM REGISTRY API] ${npmPkg} doesn't exist on npm registry, add npmPkg to its entry or remove it!`
      );
      return { ...pkgData, npm: pkgData.npm };
    }

    const latestVersion = registryData['dist-tags'].latest;

    if (!latestVersion) {
      console.warn(
        `[NPM REGISTRY API] ${npmPkg} doesn't have the "latest" tag, skipping bundle size!`
      );
      return { ...pkgData, npm: pkgData.npm };
    }

    return {
      ...pkgData,
      npm: {
        ...pkgData.npm,
        size: registryData.versions[latestVersion].dist.unpackedSize,
      },
    };
  } catch (error) {
    if (attemptsCount >= ATTEMPTS_LIMIT) {
      console.error('[NPM REGISTRY API] Looks like we have reach the NPM API rate limit!');
      console.error(error);
      return { ...pkgData, npm: pkgData.npm };
    }
    await sleep(REQUEST_SLEEP, REQUEST_SLEEP * 2);
    console.log(`[NPM REGISTRY API] Retrying fetch for ${npmPkg} (${attemptsCount + 1})`);
    return await fetchNpmRegistryData(pkgData, attemptsCount + 1);
  }
}
