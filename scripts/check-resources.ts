import { fetch } from 'bun';

import { type LibraryDataEntryType } from '~/types';

import libraries from '../react-native-libraries.json';
import { sleep } from './helpers';

async function runThrottledFetches(libraries: LibraryDataEntryType[], delayMs = 50) {
  const urlList: string[] = [];

  for (const lib of libraries) {
    if (lib.examples) {
      for (const exampleUrl of lib.examples) {
        urlList.push(exampleUrl);
      }
    }
    if (lib.images) {
      for (const imgUrl of lib.images) {
        urlList.push(imgUrl);
      }
    }
  }

  console.log(`⬇️ Attempting to fetch examples and images (${urlList.length} URLs)`);

  for (const url of urlList) {
    try {
      const response = await fetch(url);
      if (response.status !== 200) {
        console.warn(`${url} returned ${response.status}`);
      }
    } catch (err: any) {
      console.warn(`${url} errored!`, err);
    }
    await sleep(delayMs);
  }
}

runThrottledFetches(libraries).catch(err => {
  console.error('❌ Unexpected error in throttled fetcher:', err);
});
