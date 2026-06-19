import { fetch } from 'bun';

import { type LibraryDataEntryType } from '~/types';

import libraries from '../react-native-libraries.json';

const CONCURRENCY = 8;
const GITHUB_URLS_ONLY = false;

async function fetchUrl(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 10_000);

  try {
    const res = await fetch(url, { signal: controller.signal, redirect: 'manual' });
    if (res.status !== 200) {
      if (res.status > 300 && res.status < 400) {
        console.warn(`⚠️ ${url} → ${res.status} (${res.headers.get('location')})`);
      } else {
        console.error(`❌ ${url} → ${res.status}`);
      }
    }
  } catch (err) {
    if (err instanceof DOMException) {
      console.error(`❌ ${url} failed to fetch:`, err.message);
    } else {
      console.error(`❌ ${url} failed to fetch!`);
    }
  } finally {
    clearTimeout(timeout);
  }
}

async function runFetches(libraries: LibraryDataEntryType[]) {
  const urls = libraries.flatMap(lib =>
    GITHUB_URLS_ONLY
      ? [lib.githubUrl]
      : [lib.githubUrl, ...(lib.examples ?? []), ...(lib.images ?? [])]
  );

  console.log(`⬇️ Fetching ${urls.length} URLs with concurrency of ${CONCURRENCY} requests`);

  let current = 0;
  let completed = 0;

  async function fetcher() {
    while (true) {
      const index = current++;
      if (index >= urls.length) {
        break;
      }

      await fetchUrl(urls[index]);

      completed++;
      if (completed % 100 === 0 || completed === urls.length) {
        console.log(`⏩ ${completed}/${urls.length} done`);
      }
    }
  }

  const batches = Array.from({ length: CONCURRENCY }, fetcher);
  await Promise.all(batches);

  console.log('✅ All fetches finished!');
}

runFetches(libraries).catch(err => {
  console.error('❌ Unexpected error:', err);
});
