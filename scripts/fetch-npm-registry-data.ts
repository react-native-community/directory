import { fetch } from 'bun';

import { type LibraryType } from '~/types';

import { sleep, REQUEST_SLEEP } from './helpers';

const ATTEMPTS_LIMIT = 2;

// NOTE(simek): to speed up we can use light-weight https://registry.npmjs.org/${npmPkg}/latest endpoint,
// if npm adds version publish time in the response, which is available when fetching full package metadata
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

    const latestRelease = registryData['dist-tags'].latest;

    if (!latestRelease) {
      console.warn(
        `[NPM REGISTRY API] ${npmPkg} doesn't have the "latest" tag, skipping bundle size!`
      );
      return { ...pkgData, npm: pkgData.npm };
    }

    return {
      ...pkgData,
      npm: {
        ...pkgData.npm,
        size: registryData.versions[latestRelease].dist.unpackedSize,
        latestRelease,
        latestReleaseDate: registryData.time[latestRelease],
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
