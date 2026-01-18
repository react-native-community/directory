import { fillNpmName } from '~/scripts/helpers';
import { type LibraryType } from '~/types';
import { VALID_ENTRY_KEYS } from '~/util/Constants';

import libraries from '../react-native-libraries.json';

const GITHUB_URL_PATTERN = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\/tree\/[\w-\\/.%@]+)?$/;

function validateLibrariesFormat(libraries: LibraryType[]) {
  console.log('🔍️Checking all libraries have the correct format');

  // Reduces the libraries array to an object of errors for each library
  const errorsList = libraries.reduce<Record<string, string[]>>((errors, library) => {
    const libraryErrors = [];
    const libraryProperties = Object.keys(library);
    const libraryWithNpmName = fillNpmName(library);

    // Check that it has the githubUrl property and that it is in the correct format
    if (!libraryProperties.includes('githubUrl')) {
      libraryErrors.push(`- Must contain a 'githubUrl' property`);
    } else if (!GITHUB_URL_PATTERN.test(library.githubUrl)) {
      libraryErrors.push(
        `- The 'githubUrl' of ${library.githubUrl} must be in the format:\nhttps://github.com/owner/repo-name or https://github.com/owner/repo-name/tree/default-branch/name for monorepos`
      );
    }

    const invalidKeys = libraryProperties.filter(key => !VALID_ENTRY_KEYS.has(key));

    if (invalidKeys.length > 0) {
      invalidKeys.forEach(key => {
        libraryErrors.push(`- Uses invalid key - ${key}`);
      });
    }

    // If there were errors, add them to the object
    if (libraryErrors.length > 0) {
      errors[libraryWithNpmName.npmPkg] = libraryErrors;
    }

    return errors;
  }, {});

  if (Object.keys(errorsList).length > 0) {
    const errorDescriptions = Object.entries(errorsList).map(
      ([npmPkg, libraryErrors], index) =>
        `Library entry for '${npmPkg}' contains errors:\n${libraryErrors.join('\n')}`
    );
    console.error('❌ Malformed libraries found:\n' + errorDescriptions.join('\n'));
    process.exit(1);
  } else {
    console.log('✅ No malformed libraries\n');
  }
}

function validateDuplicateLibraries(libraries: LibraryType[]) {
  console.log('🔍️Checking for duplicate libraries');

  const librariesName = libraries.map(
    library => library.npmPkg ?? library.githubUrl.split('/').at(-1)
  );
  const occurrences = librariesName.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {});

  const duplicateLibraries = [...new Set(librariesName.filter(item => occurrences[item] !== 1))];

  if (duplicateLibraries.length > 0) {
    console.error(
      '❌ Duplicate libraries found:\n' +
        duplicateLibraries.map(library => `- ${library}`).join('\n')
    );
    console.error('Remove these duplicates before commiting.');
    process.exit(1);
  } else {
    console.log('✅ No duplicates');
  }
}

validateLibrariesFormat(libraries);
validateDuplicateLibraries(libraries);
