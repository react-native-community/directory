import fetch from 'cross-fetch';
import differenceWith from 'lodash/differenceWith.js';
import isEqual from 'lodash/isEqual.js';

import { fetchGithubData } from './fetch-github-data.js';
import { fetchNpmData } from './fetch-npm-data.js';
import { fillNpmName, hasMismatchedPackageData } from './helpers.js';
import libraries from '../react-native-libraries.json' with { type: 'json' };

async function makeBaseFileQuery() {
  const result = await fetch(
    'https://raw.githubusercontent.com/react-native-community/directory/main/react-native-libraries.json'
  );
  return await result.json();
}

const mainData = await makeBaseFileQuery();

if (libraries.length === mainData.length) {
  console.log('✅ There was no data changes detected!');
  process.exit(0);
}

console.log('🔍️ Detected changes in data entries, checking!');

const modifiedEntries = differenceWith(libraries, mainData, isEqual);

const checkResults = await Promise.all(
  modifiedEntries.map(async entry => {
    const entryWithNpmData = await fetchNpmData(fillNpmName(entry));

    if (!entryWithNpmData.npm) {
      console.error(
        `Unable to fetch npm package data for ${entryWithNpmData.npmPkg} package! Please make sure that the package exist in npm registry.`
      );
      console.error(
        `For the new packages recently published for the first time, npm API can return non-existing package error. The resolution here is to wait up to 24h, and then re-trigger the CI workflow.`
      );
      console.error(
        `To check the current API response visit: https://api.npmjs.org/downloads/point/last-month/${entryWithNpmData.npmPkg}`
      );
      return false;
    }

    const entryWithGitHubData = await fetchGithubData(entryWithNpmData);

    if (!entryWithGitHubData.github) {
      console.error(
        `Unable to fetch data from ${entryWithGitHubData.githubUrl} repository! Make sure that repository is public, and URL is correct.`
      );
      return false;
    }

    if (entryWithGitHubData.github.isPackagePrivate === false) {
      console.error(
        `Extracted 'package.json' from ${entryWithGitHubData.githubUrl} is marked as private! You might be linking to the monorepo/workspace root, instead of wanted package directory.`
      );
      return false;
    }

    if (!entryWithGitHubData.github.name) {
      console.error(
        `Extracted 'package.json' from ${entryWithGitHubData.githubUrl} does not contains package name! You might be linking to the monorepo/workspace root, instead of wanted package directory.`
      );
      return false;
    }

    if (hasMismatchedPackageData(entryWithGitHubData)) {
      console.error(
        `Package name extracted from 'package.json' at given GitHub repository URL differs with package name in the directory data!`
      );
      console.error(
        `- Supplied package name: ${entryWithGitHubData.npmPkg ?? entryWithGitHubData.githubUrl.split('/').at(-1)}`
      );
      console.error(
        `- Extracted package name: ${entryWithGitHubData.github.name ?? entryWithGitHubData.github.fullName.split('/').at(-1)}`
      );
      console.error(
        `If package is a part of monorepo, 'githubUrl' must point to directory where 'package.json' for a given package resides.`
      );

      return false;
    }
    return true;
  })
);

if (checkResults.filter(result => !result).length > 0) {
  console.error('\n❌ There were errors spotted during new entries check!');
  process.exit(1);
}
console.log('✅ All checks have passed!');
