import { list } from '@vercel/blob';
import { readFileSync, writeFileSync } from 'node:fs';

import { type DataAssetType, type LibraryType } from '~/types';
import { CHECK_DATA_PATH, DATA_PATH } from '~/util/Constants';

import { getNewArchSupportStatus } from './newArchStatus';

export async function fetchLatestData() {
  if (process.env.USE_LOCAL_DATA_FILE === 'true') {
    console.log('⚠️ Only writing to local data file, skipping blob store fetch');
    return {
      latestData: readLocalDataFile(),
    };
  }

  const { blobs } = await list();

  if (blobs?.length > 0) {
    const sortedBlobs = blobs.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    const response = await fetch(sortedBlobs[0].downloadUrl);

    return {
      latestData: await response.json(),
    };
  }

  return {
    latestData: readLocalDataFile(),
  };
}

export function readLocalDataFile() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf8')) as DataAssetType;
}

export function createCheckEndpointBlob(libraries: LibraryType[]) {
  const checkData = Object.fromEntries(
    libraries.map(library => [
      library.npmPkg,
      {
        unmaintained: library.unmaintained,
        newArchitecture: getNewArchSupportStatus(library),
      },
    ])
  );

  writeFileSync(CHECK_DATA_PATH, JSON.stringify(checkData, null, 2));
}
