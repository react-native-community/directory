import fs from 'node:fs';

import { type DataAssetType } from '~/types';
import { createCheckEndpointBlob, fetchLatestData } from '~/util/blob';
import { DATA_PATH } from '~/util/Constants';

const { latestData }: { latestData: DataAssetType } = await fetchLatestData();

fs.writeFileSync(DATA_PATH, JSON.stringify(latestData, null, 2));

createCheckEndpointBlob(latestData.libraries);
