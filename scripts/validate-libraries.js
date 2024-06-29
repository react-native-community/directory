import libraries from '../react-native-libraries.json' assert { type: 'json' };

const GITHUB_URL_PATTERN = /^https:\/\/github\.com\/[\w-]+\/[\w-]+(\/tree\/[\w-\\/\\.\\%\\@]+)?$/g;

const validateLibrariesFormat = libraries => {
  console.log('🔍️Checking all libraries have the correct format');

  // Reduces the libraries array to an object of errors for each library
  const errorsList = libraries.reduce((errors, library, index) => {
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
    console.log('✅ No malformed libraries');
  }
};

const validateDuplicateLibraries = libraries => {
  console.log('🔍️Checking for duplicate libraries');

  const duplicateLibraries = Object.entries(
    libraries
      // Reduce the library names to an object with the name as the key and the count as the value
      .map(library => library.githubUrl)
      .reduce((currentCount, libraryName) => {
        const previousCount = currentCount[libraryName] || 0;
        currentCount[libraryName] = previousCount + 1;
        return currentCount;
      }, {})
    // Convert to pairs and then filter based on the count
  )
    .filter(([_, count]) => count[1] > 1)
    // Map back to the library name and return the value
    .map(([libraryUrl, _]) => libraryUrl);

  if (duplicateLibraries.length > 0) {
    console.error('❌ Duplicate libraries found:\n' + duplicateLibraries.join('\n'));
    console.error('Remove these duplicates before commiting.');
    process.exit(1);
  } else {
    console.log('✅ No duplicates');
  }
};

validateLibrariesFormat(libraries);
console.log(''); // Add in a line break
validateDuplicateLibraries(libraries);
