import { BlobAccessError, list, put } from '@vercel/blob';
import fetch from 'cross-fetch';
import chunk from 'lodash/chunk.js';
import fs from 'node:fs';
import path from 'node:path';

import { calculateDirectoryScore, calculatePopularityScore } from './calculate-score.js';
import { fetchGithubData, fetchGithubRateLimit, loadGitHubLicenses } from './fetch-github-data.js';
import { fetchNpmData, fetchNpmDataBulk } from './fetch-npm-data.js';
import fetchReadmeImages from './fetch-readme-images.js';
import { fillNpmName, hasMismatchedPackageData, sleep } from './helpers.js';
import debugGithubRepos from '../debug-github-repos.json' with { type: 'json' };
import githubRepos from '../react-native-libraries.json' with { type: 'json' };
import { isLaterThan, TimeRange } from '../util/datetime.js';
import { isEmptyOrNull } from '../util/strings.js';

// Uses debug-github-repos.json instead, so we have less repositories to crunch
// each time we run the script
const USE_DEBUG_REPOS = false;
const DATASET = USE_DEBUG_REPOS ? debugGithubRepos : githubRepos;

// Loads the GitHub API results from disk rather than hitting the API each time.
// The first run will hit the API if raw-github-results.json doesn't exist yet.
const LOAD_GITHUB_RESULTS_FROM_DISK = false;

// If script should try to scrape images from GitHub repositories.
const SCRAPE_GH_IMAGES = true;
const DATA_PATH = path.resolve('assets', 'data.json');
const GITHUB_RESULTS_PATH = path.join('scripts', 'raw-github-results.json');

const invalidRepos = [];
const mismatchedRepos = [];

const wantedPackageName = process.argv[2];

const buildAndScoreData = async () => {
  console.log('⬇️️ Fetching latest data blob from the store');

  const { latestData } = await fetchLatestData();

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

  console.log('\n⬇️ Fetching download stats from npm');

  // https://github.com/npm/registry/blob/main/docs/download-counts.md#bulk-queries
  let bulkList = [];

  // Fetch scoped packages data
  data = await Promise.all(
    data.map(project => {
      if (!project.template) {
        if (project.npmPkg.startsWith('@')) {
          return fetchNpmData(project);
        } else {
          bulkList.push(project.npmPkg);
          return project;
        }
      }
      return project;
    })
  );

  // https://github.com/npm/registry/blob/main/docs/download-counts.md#limits
  const CHUNK_SIZE = 50;

  // Assemble and fetch regular packages data in bulk queries
  bulkList = [...Array(Math.ceil(bulkList.length / CHUNK_SIZE))].map(_ =>
    bulkList.splice(0, CHUNK_SIZE)
  );

  const downloadsList = (
    await Promise.all(
      bulkList.map(async (chunk, index) => {
        await sleep(2000 * index);
        return await fetchNpmDataBulk(chunk);
      })
    )
  ).flat();

  const downloadsListWeek = (
    await Promise.all(
      bulkList.map(async (chunk, index) => {
        await sleep(2000 * index);
        return await fetchNpmDataBulk(chunk, 'week');
      })
    )
  ).flat();

  // Fill npm data from bulk queries
  data = data.map(project => ({
    ...project,
    npm: {
      ...(downloadsList.find(entry => entry.name === project.npmPkg)?.npm ??
        latestData.libraries.find(entry => entry.name === project.npmPkg)?.npm ??
        {}),
      ...(downloadsListWeek.find(entry => entry.name === project.npmPkg)?.npm ??
        latestData.libraries.find(entry => entry.name === project.npmPkg)?.npm ??
        {}),
    },
  }));

  console.log('\n⚛️ Calculating Directory Score');
  data = data.map(project => {
    try {
      return calculateDirectoryScore(project);
    } catch (e) {
      console.error(`Failed to calculate score for ${project.github.name}`, e.message);
    }
  });

  console.log('\n🧮 Calculating popularity');
  data = data.map(project => {
    try {
      return calculatePopularityScore(project);
    } catch (e) {
      console.error(`Failed to calculate popularity for ${project.github.name}`, e.message);
      console.error(project.githubUrl);
    }
  });

  console.log('\n🏷️ Processing topics');
  const topicCounts = {};
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

    fileContent = JSON.stringify(
      {
        libraries: [...libraries.filter(lib => missingData.includes(lib.npmPkg)), ...data],
        topics: topicCounts,
        topicsList: Object.keys(topicCounts).sort(),
      },
      null,
      2
    );
  }

  if (!USE_DEBUG_REPOS) {
    await uploadToStore(fileContent);
  }

  return fs.writeFileSync(DATA_PATH, fileContent);
};

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

function getDataForFetch(wantedPackage) {
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

async function loadRepositoryDataAsync() {
  const data = getDataForFetch(wantedPackageName);

  let githubResultsFileExists = false;
  try {
    fs.statSync(GITHUB_RESULTS_PATH);
    githubResultsFileExists = true;
  } catch {}

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
    `${apiLimitRemaining} of ${apiLimit} GitHub API requests remaining for the hour at a cost of ${apiLimitCost} per request`
  );

  await loadGitHubLicenses();

  let result;
  if (LOAD_GITHUB_RESULTS_FROM_DISK && githubResultsFileExists) {
    result = fs.readFileSync(GITHUB_RESULTS_PATH);
    console.log('Loaded Github results from disk, skipped API calls');
  } else {
    result = await fetchGithubDataThrottled({ data, chunkSize: 25, staggerMs: 5000 });

    if (LOAD_GITHUB_RESULTS_FROM_DISK) {
      fs.writeFileSync(GITHUB_RESULTS_PATH, JSON.stringify(result, null, 2));
      console.log('Saved Github results from disk');
    }
  }

  return result;
}

async function fetchLatestData() {
  const { blobs } = await list();

  if (blobs?.length > 0) {
    const sortedBlobs = blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    const response = await fetch(sortedBlobs[0].downloadUrl);

    return {
      latestData: await response.json(),
    };
  }

  return JSON.parse(fs.readFileSync(DATA_PATH).toString());
}

async function uploadToStore(fileContent) {
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

buildAndScoreData();
