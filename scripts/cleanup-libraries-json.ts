import { identity, omit, pickBy } from 'es-toolkit';
import fs from 'node:fs';
import path from 'node:path';

import libraries from '~/react-native-libraries.json';
import { type LibraryDataEntryType } from '~/types';

const LIBRARIES_JSON_PATH = path.join('react-native-libraries.json');

const emptyPropertiesToKeep = ['newArchitecture'];

function removeEmptyArray(lib: LibraryDataEntryType, key: 'examples' | 'images') {
  return lib[key] && !lib[key].length ? omit(lib, [key]) : lib;
}

const processedLibraries = libraries
  // Remove redundant `npmPkg` for libraries with the correct GitHub repository name
  .map((lib: LibraryDataEntryType) =>
    lib.npmPkg && !lib.npmPkg.includes('/') && lib.githubUrl.endsWith(`/${lib.npmPkg}`)
      ? omit(lib, ['npmPkg'])
      : lib
  )
  // Remove empty arrays
  .map(lib => removeEmptyArray(lib, 'examples'))
  .map(lib => removeEmptyArray(lib, 'images'))
  // Remove all properties with `false` value, except those listed in emptyPropertiesToKeep
  .map(lib =>
    pickBy(lib, (value, key) => {
      if (emptyPropertiesToKeep.includes(key)) {
        return true;
      } else {
        return !!identity(value);
      }
    })
  );

fs.writeFileSync(LIBRARIES_JSON_PATH, JSON.stringify(processedLibraries, null, 2));
