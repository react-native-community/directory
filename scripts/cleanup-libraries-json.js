import jsonfile from 'jsonfile';
import identity from 'lodash/identity';
import omit from 'lodash/omit';
import pickBy from 'lodash/pickBy';
import path from 'path';

import libraries from '../react-native-libraries.json';

const LIBRARIES_JSON_PATH = path.join('react-native-libraries.json');

const removeEmptyArray = (lib, key) => (lib[key] && !lib[key].length ? omit(lib, key) : lib);

const processedLibraries = libraries
  // Remove redundant `npmPkg` for libraries with correct GitHub repository name
  .map(lib =>
    lib.npmPkg && !lib.npmPkg.includes('/') && lib.githubUrl.endsWith(`/${lib.npmPkg}`)
      ? omit(lib, 'npmPkg')
      : lib
  )
  // Remove empty arrays
  .map(lib => removeEmptyArray(lib, 'examples'))
  .map(lib => removeEmptyArray(lib, 'images'))
  // Remove all properties with `false` value
  .map(lib => pickBy(lib, identity));

jsonfile.writeFile(
  LIBRARIES_JSON_PATH,
  processedLibraries,
  {
    spaces: 2,
  },
  err => {
    if (err) {
      console.error(err);
    }
  }
);
