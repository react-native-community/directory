import { fetch } from 'bun';
import { differenceWith, isEqual } from 'es-toolkit';

import { type LibraryDataEntryType, type LibraryType } from '~/types';
import { VALID_ENTRY_KEYS } from '~/util/Constants';

import libraries from '../react-native-libraries.json';

import { fetchGithubData } from './fetch-github-data';
import { fetchNpmDownloadData } from './fetch-npm-download-data';
import { fillNpmName, hasMismatchedPackageData, sleep } from './helpers';

async function makeBaseFileQuery() {
  const result = await fetch(
    'https://raw.githubusercontent.com/react-native-community/directory/main/react-native-libraries.json'
  );
  return (await result.json()) as LibraryDataEntryType[];
}

const mainData = await makeBaseFileQuery();
const modifiedEntries = differenceWith(libraries, mainData, isEqual);

if (modifiedEntries.length === 0) {
  console.log('✅ There was no data changes detected!');
  process.exit(0);
}

console.log('🚩️ Detected changes in data entries, checking!');

const BATCH_SIZE = 5;
const STAGGER_MS = 1000;
const BATCH_DELAY_MS = 3000;

const checkResults = [];

for (let i = 0; i < modifiedEntries.length; i += BATCH_SIZE) {
  const batch = modifiedEntries.slice(i, i + BATCH_SIZE);

  const batchResults = await Promise.all(
    batch.map(entry =>
      (async () => {
        await sleep(STAGGER_MS);

        const entryWithNpmData = await fetchNpmDownloadData(fillNpmName(entry));

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

        const entryWithGitHubData = (await fetchGithubData(entryWithNpmData)) as LibraryType;

        if (!entryWithGitHubData.github) {
          console.error(
            `Unable to fetch data from ${entryWithGitHubData.githubUrl} repository! Make sure that repository is public, and URL is correct.`
          );
          return false;
        }

        if (entryWithGitHubData.github.isPrivate === true) {
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

        const invalidKeys = Object.keys(entry).filter(key => !VALID_ENTRY_KEYS.has(key));

        if (invalidKeys.length > 0) {
          console.error(
            `Package entry for '${entryWithGitHubData.npmPkg}' contains invalid fields: ${invalidKeys.map(key => `'${key}'`).join(', ')}. Correct or remove the listed keys to fix the definition.`
          );
          return false;
        }

        if (mainData.some(({ githubUrl }) => githubUrl === entryWithNpmData.githubUrl)) {
          if (entryWithGitHubData?.alternatives && entryWithGitHubData.alternatives.length > 0) {
            const existingEntryResponse = await fetch(
              `https://reactnative.directory/api/library?name=${entryWithGitHubData.npmPkg}`
            );

            if (existingEntryResponse.status !== 200) {
              console.error('Cannot fetch the modified library data from the directory.');
              return false;
            }

            const existingEntryJson = (await existingEntryResponse.json()) as Record<
              string,
              LibraryType
            >;

            if (
              !existingEntryJson[entryWithGitHubData.npmPkg].unmaintained &&
              existingEntryJson[entryWithGitHubData.npmPkg].newArchitecture !== false
            ) {
              console.error(
                `Cannot set alternatives for the ${entryWithGitHubData.npmPkg} package which is not marked as unmaintained or not supporting New Architecture.`
              );
              return false;
            }
          }
        }

        if (entryWithGitHubData?.alternatives && entryWithGitHubData.alternatives.length > 0) {
          const alternativesDataResponse = await fetch(
            `https://reactnative.directory/api/library?name=${entryWithGitHubData.alternatives.join(',')}`
          );

          if (alternativesDataResponse.status !== 200) {
            console.error('Cannot check the alternative library existence in the directory.');
            return false;
          }

          const alternativesDataJson = (await alternativesDataResponse.json()) as Record<
            string,
            LibraryType
          >;

          const alternativesChecks = entryWithGitHubData.alternatives.map(alternative => {
            if (alternative in alternativesDataJson) {
              if (alternativesDataJson[alternative].unmaintained) {
                console.error(
                  `${alternative} is marked as unmaintained in the directory, so it cannot be defined as an alternative for the package.`
                );
                return false;
              }
            } else {
              console.error(
                `${alternative} is not listed in the directory, so it cannot be defined as an alternative for the package.`
              );
              return false;
            }
            return true;
          });

          if (alternativesChecks.includes(false)) {
            return false;
          }
        }

        return true;
      })()
    )
  );

  checkResults.push(...batchResults);

  if (i + BATCH_SIZE < modifiedEntries.length) {
    await sleep(BATCH_DELAY_MS);
  }
}

if (checkResults.some(result => !result)) {
  console.error('\n❌ There were errors spotted during new entries check!');
  process.exit(1);
}

console.log('✅ All checks have passed!');
