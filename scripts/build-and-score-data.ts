import { BlobAccessError, list, put } from '@vercel/blob';
import { fetch } from 'bun';
import { chunk } from 'es-toolkit';
import fs from 'node:fs';
import path from 'node:path';

import debugGithubRepos from '~/debug-github-repos.json';
import githubRepos from '~/react-native-libraries.json';
import { fetchNpmRegistryData } from '~/scripts/fetch-npm-registry-data';
import { fetchNpmStatDataBulk } from '~/scripts/fetch-npm-stat-data';
import { type APIResponseType, type LibraryDataEntryType, type LibraryType } from '~/types';
import { isLaterThan, TimeRange } from '~/util/datetime';
import { getNewArchSupportStatus } from '~/util/newArchStatus';
import { isEmptyOrNull } from '~/util/strings';

import { calculateDirectoryScore, calculatePopularityScore } from './calculate-score';
import { fetchGithubData, fetchGithubRateLimit, loadGitHubLicenses } from './fetch-github-data';
import fetchNightlyProgramData from './fetch-nightly-program-data';
import fetchReadmeImages from './fetch-readme-images';
import { fillNpmName, hasMismatchedPackageData, sleep } from './helpers';

// Uses debug-github-repos.json instead, so we have less repositories to crunch
// each time we run the script
const USE_DEBUG_REPOS = false;

// If script should only write to the local data file and not upload to the store.
// This is useful for debugging and testing purposes.
const ONLY_WRITE_LOCAL_DATA_FILE = false;

// If script should try to scrape images from GitHub repositories.
const SCRAPE_GH_IMAGES = false;

const DATASET: LibraryDataEntryType[] = USE_DEBUG_REPOS ? debugGithubRepos : githubRepos;
const DATA_PATH = path.resolve('assets', 'data.json');
const CHECK_DATA_PATH = path.resolve('assets', 'check-data.json');

const CHUNK_SIZE = 25;
const NPM_STATS_CHUNK_SIZE = 10;
const SLEEP_TIME = 250;

const invalidRepos: string[] = [];
const mismatchedRepos: LibraryType[] = [];

const wantedPackageName = process.argv[2];

async function buildAndScoreData() {
  console.log('🔄️️ Fetching latest data blob from the store');

  const { latestData }: { latestData: APIResponseType } = await fetchLatestData();

  console.log('🗂️️ Loading data from GitHub');

  let data = await loadRepositoryDataAsync();

  data = data.filter(project => {
    if (!project.github || isEmptyOrNull(project.github.name)) {
      invalidRepos.push(project.githubUrl);
      return false;
    }
    return !isEmptyOrNull(project.github.name);
  });

  // Detect mismatched package and package.json content
  data.forEach(project => {
    if (hasMismatchedPackageData(project) && !project.template) {
      mismatchedRepos.push(project);
    }
  });

  // Mark libraries as `unmaintained` automatically
  data = data.map(project => {
    if (!project.unmaintained) {
      if (project.github.isArchived) {
        project.unmaintained = true;
      } else if (isLaterThan(project.github.stats.pushedAt, TimeRange.YEAR * 2)) {
        project.unmaintained = true;
      }
    }
    return project;
  });

  if (SCRAPE_GH_IMAGES) {
    console.log('\n📝 Scraping images from README');
    data = await Promise.all(data.map(project => fetchReadmeImages(project)));
  }

  console.log('\n🔖 Determining npm package names');
  data = data.map(fillNpmName);

  console.log('\n⬇🔄 Fetching download stats from npm-stat');

  const fetchList: string[] = [];

  // Filter out template entries, prepare npm-stat API chunks
  data = data.map(project => {
    if (!project.template) {
      fetchList.push(project.npmPkg);
      return project;
    }
    return project;
  });

  // Assemble and fetch packages data in bulk queries
  const bulkList = [...Array(Math.ceil(fetchList.length / NPM_STATS_CHUNK_SIZE))].map(_ =>
    fetchList.splice(0, NPM_STATS_CHUNK_SIZE)
  );

  const downloadsList = await fetchNpmStatDataSequentially(bulkList);

  // Fill npm data from bulk queries
  data = data.map(project => ({
    ...project,
    npm: {
      ...(downloadsList.find(entry => entry.name === project.npmPkg)?.npm ?? project.npm),
    },
  }));

  console.log('\n⬇🔄 Fetching registry data from npm');

  data = await fetchNpmRegistryDataSequentially(data);

  console.log('\n⬇🔄 Fetching nightly programme information');

  data = await fetchNightlyProgramData(data);

  console.log('\n⚛️ Calculating Directory Score');
  data = data.map(project => {
    try {
      return calculateDirectoryScore(project);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to calculate score for ${project.github.name}`, error.message);
      }
    }
    return project;
  });

  console.log('\n🧮 Calculating popularity');
  data = data.map(project => {
    try {
      return calculatePopularityScore(project);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to calculate popularity for ${project.github.name}`, error.message);
        console.error(project.githubUrl);
      }
    }
    return project;
  });

  console.log('\n🏷️ Processing topics');
  const topicCounts: Record<string, number> = {};
  data.forEach((project, index, projectList) => {
    let topicSearchString = '';

    if (project.github.topics) {
      project.github.topics.forEach(topic => {
        topicSearchString = `${topicSearchString} ${topic}`;

        if (!topicCounts[topic]) {
          topicCounts[topic] = 1;
          return;
        }

        topicCounts[topic] += 1;
      });
    }

    projectList[index].topicSearchString = topicSearchString.trim();
  });

  if (invalidRepos.length) {
    console.warn(
      '\n 🚨 The following repositories were unable to fetch from GitHub, they may need to be removed from react-native-libraries.json:'
    );
    invalidRepos.forEach(repoUrl => console.warn(`- ${repoUrl}`));
  }

  if (mismatchedRepos.length) {
    console.warn(
      `\n 🚨 The following projects repository URLs (${mismatchedRepos.length}) are misaligned with the package name extracted from package.json:`
    );
    mismatchedRepos.forEach(project =>
      console.warn(`- ${project.githubUrl}: ${project.github.name}`)
    );
  }

  console.log('📄️ Preparing data file');

  const { libraries, ...rest } = latestData;

  let fileContent;

  if (wantedPackageName) {
    fileContent = JSON.stringify(
      {
        libraries: libraries.map(library => {
          if (library.npmPkg === wantedPackageName) {
            return data.find(entry => entry.npmPkg === wantedPackageName);
          }
          return library;
        }),
        ...rest,
      },
      null,
      2
    );
  } else {
    const existingData = libraries.map(lib => lib.npmPkg);
    const newData = data.map(lib => lib.npmPkg);
    const missingData = existingData.filter(npmPkg => !newData.includes(npmPkg));

    const existingPackages = (DATASET as LibraryType[]).map(fillNpmName).map(lib => lib.npmPkg);
    const dataToFill = missingData.filter(npmPkg => !existingPackages.includes(npmPkg));

    const currentData = [...libraries.filter(lib => dataToFill.includes(lib.npmPkg)), ...data];

    const dataWithFallback: LibraryType[] = currentData.map(entry => {
      if (entry.npm?.downloads) {
        return entry;
      }

      const fallbackData = latestData.libraries.find(
        (prevEntry: LibraryType) => entry.npmPkg === prevEntry.npmPkg
      );

      if (!fallbackData) {
        return entry;
      }

      return {
        ...entry,
        npm: {
          ...(entry.npm ?? {}),
          downloads: fallbackData.npm?.downloads,
          weekDownloads: fallbackData.npm?.weekDownloads,
        },
      };
    });

    const validEntries = data.map((entry: LibraryDataEntryType) => entry.githubUrl);
    const finalData = dataWithFallback
      .filter(({ npmPkg }) => existingPackages.includes(npmPkg))
      .filter((entry: LibraryType) => validEntries.includes(entry.githubUrl));

    const sortedTopicCounts = Object.fromEntries(
      Object.entries(topicCounts).sort((a, b) => b[1] - a[1])
    );

    fileContent = JSON.stringify(
      {
        libraries: finalData,
        topics: sortedTopicCounts,
        topicsList: Object.keys(topicCounts).sort(),
      },
      null,
      2
    );

    createCheckEndpointData(finalData);
  }

  if (!(USE_DEBUG_REPOS || ONLY_WRITE_LOCAL_DATA_FILE)) {
    await uploadToStore(fileContent);
  }

  fs.writeFileSync(DATA_PATH, fileContent);
}

export function createCheckEndpointData(libraries: LibraryType[]) {
  const checkData = Object.fromEntries(
    libraries.map(library => [
      library.npmPkg,
      {
        unmaintained: library.unmaintained,
        newArchitecture: getNewArchSupportStatus(library),
      },
    ])
  );

  fs.writeFileSync(CHECK_DATA_PATH, JSON.stringify(checkData, null, 2));
}

export async function fetchGithubDataThrottled({
  data,
  chunkSize,
  staggerMs,
}: {
  data: LibraryType[];
  chunkSize: number;
  staggerMs: number;
}) {
  let results: LibraryType[] = [];
  const chunks = chunk(data, chunkSize);

  for (const chunk of chunks) {
    if (chunks.indexOf(chunk) > 0) {
      console.log(`${results.length} of ${data.length} fetched`);
      await sleep(staggerMs);
    }

    const partialResult = await Promise.all(chunk.map(data => fetchGithubData(data)));
    results = [...results, ...partialResult];

    if (partialResult.length !== chunk.length) {
      throw new Error(
        `Error in fetching data from GitHub... Expected ${chunk.length} results but only received ${partialResult.length}`
      );
    }
  }

  return results;
}

function getDataForFetch(wantedPackage?: string) {
  if (wantedPackage) {
    const match = DATASET.find(
      entry =>
        entry?.npmPkg === wantedPackageName || entry.githubUrl.endsWith(`/${wantedPackageName}`)
    );
    if (!match) {
      console.error(`❌ Package named "${wantedPackageName}" does not exist in the dataset!`);
      process.exit(1);
    }
    return [match];
  }
  return DATASET;
}

async function loadRepositoryDataAsync(): Promise<LibraryType[]> {
  const data = getDataForFetch(wantedPackageName) as LibraryType[];

  const { apiLimit, apiLimitRemaining, apiLimitCost } = await fetchGithubRateLimit();

  // 5000 requests per hour is the authenticated API request rate limit
  if (!apiLimit || apiLimit < 5000) {
    throw new Error('GitHub API token is invalid or query is not properly configured.');
  }

  // Error out if not enough remaining
  if (apiLimitRemaining < data.length * apiLimitCost) {
    throw new Error('Not enough requests left on GitHub API rate limiting to proceed.');
  }

  console.info(
    `${apiLimitRemaining} of ${apiLimit} GitHub API requests remaining for the hour at a cost of ${apiLimitCost} per request.`
  );

  await loadGitHubLicenses();

  return await fetchGithubDataThrottled({ data, chunkSize: CHUNK_SIZE, staggerMs: SLEEP_TIME });
}

async function fetchLatestData() {
  if (ONLY_WRITE_LOCAL_DATA_FILE) {
    console.log('⚠️ Only writing to local data file, skipping blob store fetch');
    return {
      latestData: JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')),
    };
  }

  const { blobs } = await list();

  if (blobs?.length > 0) {
    const sortedBlobs = blobs.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    const response = await fetch(sortedBlobs[0].downloadUrl);

    return {
      latestData: await response.json(),
    };
  }

  return JSON.parse(fs.readFileSync(DATA_PATH).toString());
}

async function uploadToStore(fileContent: string) {
  console.log('⬆️ Uploading data blob to the store');
  try {
    await put('data.json', fileContent, { access: 'public' });
  } catch (error) {
    if (error instanceof BlobAccessError) {
      console.error('❌ Cannot access the blob store, aborting!');
      throw error;
    } else {
      throw error;
    }
  }
}

async function fetchNpmStatDataSequentially(bulkList: string[][]) {
  const total = bulkList.flat().length;
  const results = [];

  for (const [chunkIndex, chunk] of bulkList.entries()) {
    await sleep(SLEEP_TIME);

    const data = await fetchNpmStatDataBulk(chunk);
    console.log(`${NPM_STATS_CHUNK_SIZE * (chunkIndex + 1)} of ${total} fetched`);

    results.push(...data);
  }
  return results;
}

async function fetchNpmRegistryDataSequentially(list: LibraryType[]) {
  const total = list.length;

  for (let i = 0; i < list.length; i++) {
    const entry = list[i];

    if (!entry || entry.template) {
      continue;
    }

    await sleep(SLEEP_TIME / 10);
    const shouldLog = i % CHUNK_SIZE === 0;

    const data = await fetchNpmRegistryData(entry);
    shouldLog && console.log(`${CHUNK_SIZE * Math.floor(i / CHUNK_SIZE)} of ${total} fetched`);

    list[i] = data;
  }

  return list;
}

await buildAndScoreData();
