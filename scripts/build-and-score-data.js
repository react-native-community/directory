import 'isomorphic-fetch';
import path from 'path';
import fs from 'fs';
import jsonfile from 'jsonfile';
import fetchGithubData from './fetch-github-data';
import calculateScore from './calculate-score';
import fetchReadmeImages from './fetch-readme-images';

import githubRepos from '../github-repos.json';
import debugGithubRepos from '../debug-github-repos.json';

// Uses debug-github-repos.json instead, so we have less repositories to crunch
// each time we run the script
const USE_DEBUG_REPOS = false;

// Loads the Github API results from disk rather than hitting the API each time.
// The first run will hit the API if raw-github-results.json doesn't exist yet.
const LOAD_GITHUB_RESULTS_FROM_DISK = false;
const GITHUB_RESULTS_PATH = path.join('scripts', 'raw-github-results.json');

const JSON_OPTIONS = {
  spaces: 2,
};

const buildAndScoreData = async () => {
  // Get basic data from Github API
  console.log('** Loading data from Github');
  let { expo, incompatible } = await loadRepositoryDataAsync();

  // Scrape images from Github
  console.log('');
  console.log('** Scraping images from README');
  expo = await Promise.all(
    expo.map(repo => fetchReadmeImages(repo, repo.urls.repo))
  );

  incompatible = await Promise.all(
    incompatible.map(repo => fetchReadmeImages(repo, repo.urls.repo))
  );

  // Calculate score
  console.log('');
  console.log('** Calculating scores');
  expo = expo.map(calculateScore);
  incompatible = incompatible.map(calculateScore);

  const jsonData = {
    expo,
    incompatible,
  };

  return jsonfile.writeFile(
    path.resolve('build', 'data.json'),
    jsonData,
    JSON_OPTIONS,
    err => {
      if (err) {
        console.log(err);
      } else {
        console.log('');
        console.log('** Done!');
      }
    }
  );
};

async function loadRepositoryDataAsync() {
  let data = USE_DEBUG_REPOS ? debugGithubRepos : githubRepos;
  let githubResultsFileExists = false;
  try {
    fs.statSync(GITHUB_RESULTS_PATH);
    githubResultsFileExists = true;
  } catch (e) {}

  let result;
  if (LOAD_GITHUB_RESULTS_FROM_DISK && githubResultsFileExists) {
    result = jsonfile.readFileSync(GITHUB_RESULTS_PATH);
    console.log('Loaded Github results from disk, skipped API calls');
  } else {
    let expo = await Promise.all(data.expo.map(fetchGithubData));
    let incompatible = await Promise.all(
      data.incompatible.map(fetchGithubData)
    );
    result = { expo, incompatible };

    if (LOAD_GITHUB_RESULTS_FROM_DISK) {
      await new Promise((resolve, reject) => {
        jsonfile.writeFile(
          GITHUB_RESULTS_PATH,
          { expo, incompatible },
          JSON_OPTIONS,
          err => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
      console.log('Saved Github results from disk');
    }
  }

  return result;
}

buildAndScoreData();
