import libraries from '../react-native-libraries.json';
import { Library } from '../types';

const GITHUB_URL_PATTERN = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\/tree\/[\w-\\/.%@]+)?$/g;

function validateLibrariesFormat(libraries: Library[]) {
  console.log('🔍️Checking all libraries have the correct format');

  // Reduces the libraries array to an object of errors for each library
  const errorsList: Record<string, string[]> = libraries.reduce((errors, library, index) => {
    const libraryErrors = [];
    const libraryProperties = Object.keys(library);

    // Check that it has the githubUrl property and that it is in the correct format
    if (!libraryProperties.includes('githubUrl')) {
      libraryErrors.push('Must contain a githubUrl property');
    } else if (!library.githubUrl.match(GITHUB_URL_PATTERN)) {
      libraryErrors.push(
        `The githubUrl of ${library.githubUrl} must be in the format:\nhttps://github.com/owner/repo-name or https://github.com/owner/repo-name/tree/default-branch/name for monorepos`
      );
    }

    // If there were errors, add them to the object
    if (libraryErrors.length > 0) {
      errors[index] = libraryErrors;
    }

    return errors;
  }, {});

  if (Object.keys(errorsList).length > 0) {
    const errorDescriptions = Object.entries(errorsList).map(
      ([index, libraryErrors]) => `Library at index ${index}:\n${libraryErrors.join('\n')}`
    );
    console.error('❌ Malformed libraries found:\n' + errorDescriptions.join('\n'));
    process.exit(1);
  } else {
    console.log('✅ No malformed libraries\n');
  }
}

function validateDuplicateLibraries(libraries: Library[]) {
  console.log('🔍️Checking for duplicate libraries');

  const librariesName = libraries.map(
    library => library.npmPkg ?? library.githubUrl.split('/').at(-1)
  );
  const occurrences = librariesName.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
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
