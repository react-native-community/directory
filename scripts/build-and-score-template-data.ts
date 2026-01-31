import { chunk } from 'es-toolkit';
import fs from 'node:fs';
import path from 'node:path';

import templateEntries from '~/react-native-templates.json';
import { fetchNpmRegistryData } from '~/scripts/fetch-npm-registry-data';
import { fetchNpmStatDataBulk } from '~/scripts/fetch-npm-stat-data';
import {
  type APITemplatesResponseType,
  type DataAssetType,
  type TemplateDataEntryType,
  type TemplateType,
} from '~/types';
import { isLaterThan, TimeRange } from '~/util/datetime';
import { isEmptyOrNull } from '~/util/strings';

import { fetchGithubData, fetchGithubRateLimit, loadGitHubLicenses } from './fetch-github-data';
import { sleep } from './helpers';

const DATASET: TemplateDataEntryType[] = templateEntries;
const DATA_PATH = path.resolve('assets', 'data-templates.json');

const CHUNK_SIZE = 25;
const NPM_STATS_CHUNK_SIZE = 10;
const SLEEP_TIME = 250;

const invalidRepos: string[] = [];
const mismatchedRepos: TemplateType[] = [];

const missingOnly = process.argv.includes('--missing-only');

async function buildAndScoreTemplatesData() {
  console.log('🔄️️ Loading latest data from the local file');

  const { latestData }: { latestData: APITemplatesResponseType } = await fetchLatestData();

  console.log('🗂️️ Loading data from GitHub');

  let data = await loadRepositoryDataAsync();

  data = data.filter(project => {
    if (!project.github || isEmptyOrNull(project.github.name)) {
      invalidRepos.push(project.githubUrl);
      return false;
    }
    return !isEmptyOrNull(project.github.name);
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

  console.log('\n⬇🔄 Fetching download stats from npm-stat');

  const fetchList: string[] = [];

  // Filter out template entries, prepare npm-stat API chunks
  data.forEach(project => {
    if (project.npmPkg) {
      fetchList.push(project.npmPkg);
    }
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

  const { templates } = latestData;

  let fileContent;

  const existingData = templates.map(lib => lib.githubUrl);
  const newData = data.map(lib => lib.githubUrl);
  const missingData = existingData.filter(githubUrl => !newData.includes(githubUrl));

  const existingPackages = (DATASET as TemplateType[]).map(lib => lib.githubUrl);
  const dataToFill = missingData.filter(githubUrl => !existingPackages.includes(githubUrl));

  const currentData = [...templates.filter(lib => dataToFill.includes(lib.githubUrl)), ...data];

  const dataWithFallback: TemplateType[] = currentData.map(entry => {
    if (entry.npm?.downloads) {
      return entry;
    }

    const fallbackData = latestData.templates.find(
      (prevEntry: TemplateType) => entry.githubUrl === prevEntry.githubUrl
    );

    if (!fallbackData) {
      return entry;
    }

    return {
      ...entry,
      npm: {
        ...entry.npm,
        downloads: fallbackData.npm?.downloads,
        weekDownloads: fallbackData.npm?.weekDownloads,
      },
    };
  });

  const validEntries = data.map((entry: TemplateDataEntryType) => entry.githubUrl);
  const finalData = dataWithFallback.filter((entry: TemplateType) =>
    validEntries.includes(entry.githubUrl)
  );

  const sortedTopicCounts = Object.fromEntries(
    Object.entries(topicCounts).sort(([kA, vA], [kB, vB]) => {
      if (vA !== vB) {
        return vB - vA;
      }
      return kA.localeCompare(kB);
    })
  );

  fileContent = JSON.stringify(
    {
      templates: finalData,
      topics: sortedTopicCounts,
    },
    null,
    2
  );

  fs.writeFileSync(DATA_PATH, fileContent);
}

export async function fetchGithubDataThrottled({
  data,
  chunkSize,
  staggerMs,
}: {
  data: TemplateType[];
  chunkSize: number;
  staggerMs: number;
}) {
  let results: TemplateType[] = [];
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

function getMissingOnlyDataset() {
  const { libraries } = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')) as DataAssetType;

  const existingGithubUrls = new Set(
    libraries.map(lib => lib.githubUrl).filter(url => !!url && !isEmptyOrNull(url))
  );
  const missing = DATASET.filter(entry => !existingGithubUrls.has(entry.githubUrl));

  console.log(
    `🧩 Missing-only mode: fetching ${missing.length} of ${DATASET.length} entries not present in data file\n`
  );

  return missing;
}

function getDataForFetch() {
  if (missingOnly) {
    return getMissingOnlyDataset();
  }

  return DATASET;
}

async function loadRepositoryDataAsync(): Promise<TemplateType[]> {
  const data = getDataForFetch() as TemplateType[];

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
  return {
    latestData: JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')),
  };
}

async function fetchNpmStatDataSequentially(bulkList: string[][]) {
  const total = bulkList.flat().length;
  const results = [];

  for (const [chunkIndex, chunk] of bulkList.entries()) {
    await sleep(SLEEP_TIME);

    const data = await fetchNpmStatDataBulk(chunk);
    console.log(`${NPM_STATS_CHUNK_SIZE * chunkIndex + chunk.length} of ${total} fetched`);

    results.push(...data);
  }
  return results;
}

async function fetchNpmRegistryDataSequentially(list: TemplateType[]) {
  const total = list.length;

  for (let i = 0; i < total; i++) {
    const entry = list[i];

    if (!entry || !entry.npmPkg) {
      continue;
    }

    await sleep(SLEEP_TIME / 10);
    const shouldLog = i % CHUNK_SIZE === 0 || i + 1 === total;

    const data = await fetchNpmRegistryData(entry);
    shouldLog &&
      console.log(
        `${CHUNK_SIZE > total && i !== 0 ? total : CHUNK_SIZE * Math.floor(i / CHUNK_SIZE)} of ${total} fetched`
      );

    list[i] = data;
  }

  return list;
}

await buildAndScoreTemplatesData();
