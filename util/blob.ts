import { list } from '@vercel/blob';
import { readFileSync, writeFileSync } from 'node:fs';

import { type DataAssetType, type DependantsDataType, type LibraryType } from '~/types';
import { CHECK_DATA_PATH, DATA_PATH, DEPENDANTS_PATH } from '~/util/Constants';

import { getNewArchSupportStatus } from './newArchStatus';

export async function fetchLatestData(): Promise<{
  latestData: DataAssetType;
  latestDependants: DependantsDataType;
}> {
  if (process.env.USE_LOCAL_DATA_FILE === 'true') {
    console.log('⚠️ Only writing to local data file, skipping blob store fetch');
    return {
      latestData: readLocalDataFile(),
      latestDependants: readLocalDependantsFile(),
    };
  }

  const { blobs } = await list();
  const latestDataBlob = getLatestBlob(blobs, 'data.json');
  const latestDependantsBlob = getLatestBlob(blobs, 'dependants.json');
  const [latestData, latestDependants] = await Promise.all([
    latestDataBlob
      ? fetch(latestDataBlob.downloadUrl).then(
          response => response.json() as Promise<DataAssetType>
        )
      : readLocalDataFile(),
    latestDependantsBlob
      ? fetch(latestDependantsBlob.downloadUrl).then(
          response => response.json() as Promise<DependantsDataType>
        )
      : readLocalDependantsFile(),
  ]);

  return { latestData, latestDependants };
}

export function readLocalDataFile() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf8')) as DataAssetType;
}

export function readLocalDependantsFile() {
  return JSON.parse(readFileSync(DEPENDANTS_PATH, 'utf8')) as DependantsDataType;
}

function getLatestBlob(blobs: Awaited<ReturnType<typeof list>>['blobs'], filename: string) {
  const basename = filename.slice(0, -'.json'.length);
  return blobs
    .filter(blob => blob.pathname === filename || blob.pathname.startsWith(`${basename}-`))
    .toSorted((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];
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
