import 'isomorphic-fetch';
import path from 'path';
import fs from 'fs';
import jsonfile from 'jsonfile';
import fetchGithubData from './fetch-github-data';
import calculateScore from './calculate-score';

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
  let data = USE_DEBUG_REPOS ? debugGithubRepos : githubRepos;
  let expo, incompatible;

  let githubResultsFileExists = false;
  try {
    fs.statSync(GITHUB_RESULTS_PATH);
    githubResultsFileExists = true;
  } catch (e) {}

  if (LOAD_GITHUB_RESULTS_FROM_DISK && githubResultsFileExists) {
    ({ expo, incompatible } = jsonfile.readFileSync(GITHUB_RESULTS_PATH));
    console.log('Loaded Github results from disk, skipped API calls');
  } else {
    expo = await Promise.all(data.expo.map(fetchGithubData));
    incompatible = await Promise.all(data.incompatible.map(fetchGithubData));

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
      }
    }
  );

  return console.log('done');
};

buildAndScoreData();
