import fetch from 'cross-fetch';
import differenceWith from 'lodash/differenceWith.js';
import isEqual from 'lodash/isEqual.js';

import { fetchGithubData } from './fetch-github-data.js';
import { fetchNpmData } from './fetch-npm-data.js';
import { fillNpmName, hasMismatchedPackageData } from './helpers.js';
import libraries from '../react-native-libraries.json' assert { type: 'json' };

async function makeBaseFileQuery() {
  const result = await fetch(
    'https://raw.githubusercontent.com/react-native-community/directory/main/react-native-libraries.json'
  );
  return await result.json();
}

const mainData = await makeBaseFileQuery();

if (libraries.length !== mainData.length) {
  console.log('🔍️ Detected changes in data entries, checking!');

  const modifiedEntries = differenceWith(libraries, mainData, isEqual);

  const checkResults = await Promise.all(
    modifiedEntries.map(async entry => {
      const entryWithNpmData = await fetchNpmData(fillNpmName(entry));

      if (!entryWithNpmData.npm) {
        console.error(
          `Unable to fetch npm package data for ${entryWithNpmData.npmPkg} package! Please make sure that the package exist in npm registry.`
        );
        return false;
      }

      const entryWithGitHubData = await fetchGithubData(entryWithNpmData);

      if (!entryWithGitHubData.github) {
        console.error(`Unable to fetch data from ${entryWithGitHubData.githubUrl} repository!`);
        return false;
      }

      if (!entryWithGitHubData.github.isPackagePrivate) {
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
}

console.log('✅ There was no data changes detected!');
