import identity from 'lodash/identity.js';
import omit from 'lodash/omit.js';
import pickBy from 'lodash/pickBy.js';
import fs from 'node:fs';
import path from 'node:path';

import libraries from '../react-native-libraries.json' with { type: 'json' };

const LIBRARIES_JSON_PATH = path.join('react-native-libraries.json');

const IGNORE_CLEANUP = ['toastify-react-native'];

const removeEmptyArray = (lib, key) => (lib[key] && !lib[key].length ? omit(lib, key) : lib);
const emptyPropertiesToKeep = ['newArchitecture'];

const processedLibraries = libraries
  // Remove redundant `npmPkg` for libraries with correct GitHub repository name
  .map(lib =>
    lib.npmPkg &&
    !lib.npmPkg.includes('/') &&
    lib.githubUrl.endsWith(`/${lib.npmPkg}`) &&
    !IGNORE_CLEANUP.includes(lib.npmPkg)
      ? omit(lib, 'npmPkg')
      : lib
  )
  // Remove empty arrays
  .map(lib => removeEmptyArray(lib, 'examples'))
  .map(lib => removeEmptyArray(lib, 'images'))
  // Remove all properties with `false` value, except those listed in emptyPropertiesToKeep
  .map(lib =>
    pickBy(lib, (value, key) => {
      console.log(key);
      if (emptyPropertiesToKeep.includes(key)) {
        return true;
      } else {
        return identity(value);
      }
    })
  );

fs.writeFileSync(LIBRARIES_JSON_PATH, JSON.stringify(processedLibraries, null, 2));
