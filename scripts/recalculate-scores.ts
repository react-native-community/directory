import fs from 'node:fs';
import path from 'node:path';

import { type DataAssetType } from '~/types';

import data from '../assets/data.json';

import { calculateDirectoryScore, calculatePopularityScore } from './calculate-score';

const LIBRARIES_JSON_PATH = path.join('assets', 'data.json');

console.log('🧮 Recalculating popularity and directory scores');

const { libraries, ...rest } = data as DataAssetType;
const processedLibraries = libraries
  .map(lib => calculatePopularityScore(lib))
  .map(lib => calculateDirectoryScore(lib));

fs.writeFileSync(
  LIBRARIES_JSON_PATH,
  JSON.stringify({ libraries: processedLibraries, ...rest }, null, 2)
);
