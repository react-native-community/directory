import { ConvexHttpClient } from 'convex/browser';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { api } from '~/convex/_generated/api.js';
import { processTopics } from '~/scripts/helpers';
import { LibraryWithConvexData } from '~/types';

const httpClient = new ConvexHttpClient(process.env['NEXT_PUBLIC_CONVEX_URL']);

async function fetchLibrariesData() {
  const librariesData = await httpClient.query(api.queries.getLibrariesData, {});

  const topicsData = processTopics(librariesData);

  const data = {
    libraries: librariesData.map((entry: LibraryWithConvexData) => {
      const { _id, _creationTime, ...rest } = entry;
      return rest;
    }),
    ...topicsData,
  };

  writeFileSync(join(process.cwd(), 'assets', 'data.json'), JSON.stringify(data, null, 2));

  console.log('Wrote assets/data.json with', librariesData.length, 'items');
}

fetchLibrariesData().catch(error => {
  console.error('❌ Cannot fetch the data from Convex, aborting!', error);
  process.exit(1);
});
