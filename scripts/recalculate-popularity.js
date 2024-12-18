import fs from 'node:fs';
import path from 'node:path';

import { calculatePopularityScore } from './calculate-score.js';
import data from '../assets/data.json' with { type: 'json' };

const LIBRARIES_JSON_PATH = path.join('assets', 'data.json');

console.log('🧮 Recalculating popularity score');

const { libraries, ...rest } = data;
const processedLibraries = libraries.map(lib => calculatePopularityScore(lib));

fs.writeFileSync(
  LIBRARIES_JSON_PATH,
  JSON.stringify({ libraries: processedLibraries, ...rest }, null, 2)
);
