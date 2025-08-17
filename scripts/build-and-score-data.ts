import { ConvexHttpClient } from 'convex/browser';
import chunk from 'lodash/chunk';
import fs from 'node:fs';
import path from 'node:path';

import { api } from '~/convex/_generated/api';
import debugGithubRepos from '~/debug-github-repos.json';
import githubRepos from '~/react-native-libraries.json';
import { fetchNpmStatDataBulk } from '~/scripts/fetch-npm-stat-data';
import { LibraryDataEntry, Library, DataFile } from '~/types';
import { isLaterThan, TimeRange } from '~/util/datetime';
import { isEmptyOrNull } from '~/util/strings';

import { calculateDirectoryScore, calculatePopularityScore } from './calculate-score';
import { fetchGithubData, fetchGithubRateLimit, loadGitHubLicenses } from './fetch-github-data';
import fetchReadmeImages from './fetch-readme-images';
import { fillNpmName, hasMismatchedPackageData, processTopics, sleep } from './helpers';

const httpClient = new ConvexHttpClient(process.env['NEXT_PUBLIC_CONVEX_URL']);
const httpAuthClient = new ConvexHttpClient(process.env['NEXT_PUBLIC_CONVEX_URL'], {
  auth: process.env['CONVEX_AUTH_KEY'],
});

// Uses debug-github-repos.json instead, so we have less repositories to crunch
// each time we run the script
const USE_DEBUG_REPOS = false;

// Loads the GitHub API results from disk rather than hitting the API each time.
// The first run will hit the API if raw-github-results.json doesn't exist yet.
const LOAD_GITHUB_RESULTS_FROM_DISK = false;

// If script should try to scrape images from GitHub repositories.
const SCRAPE_GH_IMAGES = false;

const DATASET: LibraryDataEntry[] = USE_DEBUG_REPOS ? debugGithubRepos : githubRepos;
const DATA_PATH = path.resolve('assets', 'data.json');
const GITHUB_RESULTS_PATH = path.join('scripts', 'raw-github-results.json');

const CHUNK_SIZE = 25;
const SLEEP_TIME = 500;

const invalidRepos = [];
const mismatchedRepos = [];

const wantedPackageName = process.argv[2];

async function buildAndScoreData() {
  console.log('⬇️️ Fetching latest data blob from Convex');

  const latestData = await httpClient.query(api.queries.getLibrariesData, {});

  console.log('📦️ Loading data from GitHub');

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

  console.log('\n⬇️ Fetching download stats from npm-stat');

  let bulkList = [];

  // Filter out template entries, prepare npm-stat API chunks
  data = data.map(project => {
    if (!project.template) {
      bulkList.push(project.npmPkg);
      return project;
    }
    return project;
  });

  // Assemble and fetch packages data in bulk queries
  bulkList = [...Array(Math.ceil(bulkList.length / CHUNK_SIZE))].map(_ =>
    bulkList.splice(0, CHUNK_SIZE)
  );

  const downloadsList = await fetchNpmStatDataSequentially(bulkList);

  // Fill npm data from bulk queries
  data = data.map(project => ({
    ...project,
    npm: {
      ...(downloadsList.find(entry => entry.name === project.npmPkg)?.npm ?? project.npm),
    },
  }));

  console.log('\n⚛️ Calculating Directory Score');
  data = data.map(project => {
    try {
      return calculateDirectoryScore(project);
    } catch (error) {
      console.error(`Failed to calculate score for ${project.github.name}`, error.message);
    }
  });

  console.log('\n🧮 Calculating popularity');
  data = data.map(project => {
    try {
      return calculatePopularityScore(project);
    } catch (error) {
      console.error(`Failed to calculate popularity for ${project.github.name}`, error.message);
      console.error(project.githubUrl);
    }
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

  console.log('\n🏷️ Processing topics');
  const topicsData = processTopics(data);

  console.log('📄️ Preparing data file');

  let fileContent: DataFile;

  if (wantedPackageName) {
    fileContent = {
      libraries: latestData.map(library => {
        if (library.npmPkg === wantedPackageName) {
          return data.find(entry => entry.npmPkg === wantedPackageName);
        }
        return library;
      }),
      ...topicsData,
    };
  } else {
    const existingData = latestData.map(lib => lib.npmPkg);
    const newData = data.map(lib => lib.npmPkg);
    const missingData = existingData.filter(npmPkg => !newData.includes(npmPkg));

    const existingPackages = DATASET.map(fillNpmName).map(lib => lib.npmPkg);
    const dataToFill = missingData.filter(npmPkg => !existingPackages.includes(npmPkg));

    const currentData = [...latestData.filter(lib => dataToFill.includes(lib.npmPkg)), ...data];

    const dataWithFallback = currentData.map(entry =>
      Object.keys(entry.npm).length > 0
        ? entry
        : {
            ...entry,
            npm: latestData.find(prevEntry => entry.npmPkg === prevEntry.npmPkg)?.npm ?? {},
          }
    );

    const validEntries = data.map((entry: LibraryDataEntry) => entry.githubUrl);

    fileContent = {
      libraries: dataWithFallback.filter((entry: Library) => {
        return validEntries.includes(entry.githubUrl);
      }),
      ...topicsData,
    };
  }

  if (!USE_DEBUG_REPOS || !process.env['CONVEX_AUTH_KEY']) {
    console.warn(fileContent.libraries);
    await httpAuthClient.mutation(api.mutations.updateLibrariesData, {
      libraries: fileContent.libraries,
    });
  }

  const dataString = JSON.stringify(fileContent, null, 2);

  return fs.writeFileSync(DATA_PATH, dataString);
}

export async function fetchGithubDataThrottled({ data, chunkSize, staggerMs }) {
  let results = [];
  const chunks = chunk(data, chunkSize);

  for (const c of chunks) {
    if (chunks.indexOf(c) > 0) {
      console.log(`${results.length} of ${data.length} fetched`);
      console.log(`Sleeping ${staggerMs}ms`);
      await sleep(staggerMs);
    }

    const partialResult = await Promise.all(c.map(fetchGithubData));
    results = [...results, ...partialResult];

    if (partialResult.length !== c.length) {
      throw new Error(
        `Error in fetching data from GitHub... Expected ${c.length} results but only received ${partialResult.length}`
      );
    }
  }

  return results;
}

function getDataForFetch(wantedPackage: string) {
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

async function loadRepositoryDataAsync(): Promise<Library[]> {
  const data = getDataForFetch(wantedPackageName);

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

  let result;
  if (LOAD_GITHUB_RESULTS_FROM_DISK) {
    try {
      result = fs.readFileSync(GITHUB_RESULTS_PATH);
      console.log('Loaded GitHub results from disk, skipping API calls.');
    } catch (error) {
      console.warn('Failed to load data from disk!', error);
    }
  } else {
    result = await fetchGithubDataThrottled({ data, chunkSize: CHUNK_SIZE, staggerMs: SLEEP_TIME });
  }

  return result;
}

async function fetchNpmStatDataSequentially(bulkList: string[][]) {
  const total = bulkList.flat().length;
  const results = [];

  for (const [chunkIndex, chunk] of bulkList.entries()) {
    await sleep(SLEEP_TIME);
    console.log(`Sleeping ${SLEEP_TIME}ms`);

    const data = await fetchNpmStatDataBulk(chunk);
    console.log(`${CHUNK_SIZE * (chunkIndex + 1)} of ${total} fetched`);

    results.push(...data);
  }
  return results;
}

await buildAndScoreData();
