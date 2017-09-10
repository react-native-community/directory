import _ from 'lodash';
import libraries from '../react-native-libraries.json';

const GITHUB_URL_PATTERN = /https:\/\/github\.com\/[\w\d-_]*\/[\w\d-_]*/g;

const validateLibrariesFormat = libraries => {
  console.log('Checking all libraries have the correct format');

  // Reduces the libraries array to an object of errors for each library
  const errors = libraries.reduce((errors, library, index) => {
    const libraryErrors = [];
    const libraryProperties = Object.keys(library);

    // Check that it has the githubUrl property and that it is in the correct format
    if (!libraryProperties.includes('githubUrl')) {
      libraryErrors.push('Must contain a githubUrl property');
    } else if (!library.githubUrl.match(GITHUB_URL_PATTERN)) {
      libraryErrors.push(
        'The githubUrl must be in the format: https://github.com/react-community/react-navigation'
      );
    }

    // If there were errors, add them to the object
    if (libraryErrors.length > 0) {
      errors[index] = libraryErrors;
    }

    return errors;
  }, {});

  if (Object.keys(errors).length > 0) {
    const errorDescriptions = _.map(errors, (libraryErrors, index) => {
      return `Library at index ${index}:\n` + libraryErrors.join('\n');
    });
    console.log(
      '✘ Malformed libraries found:\n' + errorDescriptions.join('\n')
    );
    process.exit(1);
  } else {
    console.log('✔︎ No malformed libraries');
  }
};

const validateDuplicateLibraries = libraries => {
  console.log('Checking for duplicate libraries');

  const duplicateLibraries = _.chain(libraries)
    // Reduce the library names to an object with the name as the key and the count as the value
    .map(library => library.githubUrl)
    .reduce((currentCount, libraryName) => {
      const previousCount = currentCount[libraryName] || 0;
      currentCount[libraryName] = previousCount + 1;
      return currentCount;
    }, {})
    // Convert to pairs and then filter based on the count
    .toPairs()
    .filter(pair => pair[1] > 1)
    // Map back to the library name and return the value
    .map(pair => pair[0])
    .value();

  if (duplicateLibraries.length > 0) {
    console.log(
      '✘ Duplicate libraries found:\n' + duplicateLibraries.join('\n')
    );
    console.log('Remove these duplicates before committing.');
    process.exit(1);
  } else {
    console.log('✔︎ No duplicates');
  }
};

validateLibrariesFormat(libraries);
console.log(''); // Add in a line break
validateDuplicateLibraries(libraries);
