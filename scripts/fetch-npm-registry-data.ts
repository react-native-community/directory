import { fetch } from 'bun';

import { type LibraryType, type NpmRegistryData } from '~/types';

import { sleep, REQUEST_SLEEP } from './helpers';

const ATTEMPTS_LIMIT = 2;

// NOTE(simek): to speed up we can use light-weight https://registry.npmjs.org/${npmPkg}/latest endpoint,
// if npm adds version publish time in the response, which is available when fetching full package metadata
function urlForPackage(npmPkg: string) {
  return `https://registry.npmjs.org/${npmPkg}`;
}

export async function fetchNpmRegistryData(
  pkgData: LibraryType,
  attemptsCount = 0
): Promise<LibraryType> {
  const { npmPkg } = pkgData;

  try {
    const url = urlForPackage(npmPkg);
    const response = await fetch(url);

    if (response.status !== 200) {
      console.error(
        `[NPM REGISTRY API] npm API has returned invalid response - status ${response.status}!`
      );
      return pkgData;
    }

    const registryData = (await response.json()) as NpmRegistryData;

    if (!registryData._id) {
      console.warn(
        `[NPM REGISTRY API] ${npmPkg} doesn't exist on npm registry, add npmPkg to its entry or remove it!`
      );
      return pkgData;
    }

    const latestRelease = registryData['dist-tags'].latest;

    if (!latestRelease) {
      console.warn(
        `[NPM REGISTRY API] ${npmPkg} doesn't have the "latest" tag, skipping bundle size!`
      );
      return pkgData;
    }

    return {
      ...pkgData,
      unmaintained:
        'deprecated' in registryData.versions[latestRelease] ? true : pkgData.unmaintained,
      npm: {
        ...pkgData.npm,
        size: registryData.versions[latestRelease].dist.unpackedSize,
        versionsCount: Object.keys(registryData.versions).length,
        latestRelease,
        latestReleaseDate: registryData.time[latestRelease],
        hasReadme: registryData.readmeFilename ? registryData.readmeFilename.length > 0 : false,
      },
    };
  } catch (error) {
    if (attemptsCount >= ATTEMPTS_LIMIT) {
      console.error('[NPM REGISTRY API] Looks like we have reach the npm API rate limit!');
      console.error(error);
      return pkgData;
    }
    await sleep(REQUEST_SLEEP, REQUEST_SLEEP * 2);
    console.log(`[NPM REGISTRY API] Retrying fetch for ${npmPkg} (${attemptsCount + 1})`);
    return await fetchNpmRegistryData(pkgData, attemptsCount + 1);
  }
}
