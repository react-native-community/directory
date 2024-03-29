import jsonfile from 'jsonfile';
import path from 'path';

import { calculatePopularityScore } from './calculate-score';
import data from '../assets/data.json';

const LIBRARIES_JSON_PATH = path.join('assets', 'data.json');

const processedLibraries = data.libraries.map(lib => calculatePopularityScore(lib));

jsonfile.writeFile(LIBRARIES_JSON_PATH, { libraries: processedLibraries }, { spaces: 2 }, err => {
  if (err) {
    console.error(err);
  }
});
