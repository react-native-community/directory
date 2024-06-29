import chunk from 'lodash/chunk.js';
import fs from 'node:fs';
import path from 'node:path';

import { calculateDirectoryScore, calculatePopularityScore } from './calculate-score.js';
import { fetchGithubData, fetchGithubRateLimit, loadGitHubLicenses } from './fetch-github-data.js';
import { fetchNpmData, fetchNpmDataBulk } from './fetch-npm-data.js';
import fetchReadmeImages from './fetch-readme-images.js';
import debugGithubRepos from '../debug-github-repos.json' assert { type: 'json' };
import githubRepos from '../react-native-libraries.json' assert { type: 'json' };
import { isEmptyOrNull } from '../util/strings.js';

// Uses debug-github-repos.json instead, so we have less repositories to crunch
// each time we run the script
const USE_DEBUG_REPOS = false;

// Loads the GitHub API results from disk rather than hitting the API each time.
// The first run will hit the API if raw-github-results.json doesn't exist yet.
const LOAD_GITHUB_RESULTS_FROM_DISK = false;
const GITHUB_RESULTS_PATH = path.join('scripts', 'raw-github-results.json');

// If script should try to scrape images from GitHub repositories.
const SCRAPE_GH_IMAGES = true;

export const sleep = (ms = 0, msMax = null) => {
  return new Promise(r =>
    setTimeout(r, msMax ? Math.floor(Math.random() * (msMax - ms)) + ms : ms)
  );
};

const fillNpmName = project => {
  if (!project.npmPkg) {
    const parts = project.githubUrl.split('/');
    project.npmPkg = parts[parts.length - 1].toLowerCase();
  }
  return project;
};

const invalidRepos = [];

const buildAndScoreData = async () => {
  console.log('** Loading data from GitHub');
  let data = await loadRepositoryDataAsync();

  data = data.filter(project => {
    if (!project.github || isEmptyOrNull(project.github.name)) {
      invalidRepos.push(project.githubUrl);
      return false;
    }
    return !isEmptyOrNull(project.github.name);
  });

  if (SCRAPE_GH_IMAGES) {
    console.log('\n📝 Scraping images from README');
    await sleep(1000);
    data = await Promise.all(data.map(project => fetchReadmeImages(project)));
  }

  console.log('\n🔖 Determining npm package name');
  await sleep(1000);
  data = data.map(fillNpmName);

  console.log('\n⬇️ Loading download stats from npm');
  await sleep(1000);

  // https://github.com/npm/registry/blob/master/docs/download-counts.md#bulk-queries
  let bulkList = [];

  // Fetch scope packages data
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

  // Assemble and fetch data in bulk queries
  const CHUNK_SIZE = 32;
  bulkList = [...Array(Math.ceil(bulkList.length / CHUNK_SIZE))].map(_ =>
    bulkList.splice(0, CHUNK_SIZE)
  );

  const downloadsList = (await Promise.all(bulkList.map(chunk => fetchNpmDataBulk(chunk)))).flat();
  const downloadsListWeek = (
    await Promise.all(bulkList.map(chunk => fetchNpmDataBulk(chunk, 'week')))
  ).flat();

  // Fill npm data from bulk queries
  data = data.map(project =>
    project.npm
      ? project
      : {
          ...project,
          npm: {
            ...(downloadsList.find(d => d.name === project.npmPkg)?.npm || {}),
            ...(downloadsListWeek.find(d => d.name === project.npmPkg)?.npm || {}),
          },
        }
  );

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

  // Process topic counts
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
      '🚨 The following repositories were unable to fetch from GitHub, they may need to be removed from react-native-libraries.json:'
    );
    invalidRepos.forEach(repoUrl => console.warn(`- ${repoUrl}`));
  }

  return fs.writeFileSync(
    path.resolve('assets', 'data.json'),
    JSON.stringify(
      {
        libraries: data,
        topics: topicCounts,
        topicsList: Object.keys(topicCounts).sort(),
      },
      null,
      2
    )
  );
};

async function fetchGithubDataThrottled({ data, chunkSize, staggerMs }) {
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

async function loadRepositoryDataAsync() {
  const data = USE_DEBUG_REPOS ? debugGithubRepos : githubRepos;
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

buildAndScoreData();
