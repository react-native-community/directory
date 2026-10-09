import fs from 'node:fs';

import { createCheckEndpointBlob, fetchLatestData } from '~/util/blob';
import { DATA_PATH, DEPENDANTS_PATH } from '~/util/Constants';

const { latestData, latestDependants } = await fetchLatestData();

fs.writeFileSync(DATA_PATH, JSON.stringify(latestData, null, 2));
fs.writeFileSync(DEPENDANTS_PATH, JSON.stringify(latestDependants, null, 2));

createCheckEndpointBlob(latestData.libraries);
