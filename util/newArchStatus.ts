import { Library } from '../types';

export enum NewArchSupportStatus {
  Supported = 'supported',
  Unsupported = 'unsupported',
  Untested = 'untested',
}

//new function  to fix new architecture support detection
export function getNewArchSupportStatus({
  newArchitecture,
  github,
  expoGo,
  lastPublish,
  maintained,
  reactNativeVersion,
}: Library) {
  // Assume untested unless indicated otherwise through one of the following tests
  let flag = undefined;

  // If the library is not maintained, it likely doesn't support the New Architecture
  if (maintained === false) {
    return NewArchSupportStatus.Unsupported;
  }

  // Check if the last publish date is before the introduction of the New Architecture
  // The New Architecture was introduced around React Native 0.68 (April 2022)
  const newArchIntroDate = new Date('2022-04-01');
  if (lastPublish && new Date(lastPublish) < newArchIntroDate) {
    return NewArchSupportStatus.Unsupported;
  }

  // Check if the React Native version in the library's package.json is older than 0.68
  // If it is, the library probably doesn't support the New Architecture
  if (reactNativeVersion && isVersionOlderThan(reactNativeVersion, '0.68.0')) {
    return NewArchSupportStatus.Unsupported;
  }

  if (typeof newArchitecture !== 'undefined') {
    flag = newArchitecture;
  } else if (github.newArchitecture === true) {
    flag = true;
  } else if (expoGo === true) {
    // We no longer automatically assume that all Expo Go libraries support the New Architecture
    // Only those that are part of the official Expo SDK
    if (github.owner === 'expo' && github.isArchived === false) {
      flag = true;
    } else {
      // For other Expo Go libraries, we consider them as "untested"
      flag = undefined;
    }
  }

  // Return the status based on the value of "flag"
  switch (flag) {
    case true:
      return NewArchSupportStatus.Supported;
    case false:
      return NewArchSupportStatus.Unsupported;
    default:
      return NewArchSupportStatus.Untested;
  }
}

// Function to compare React Native versions (to check if it's older than a given version)
function isVersionOlderThan(version: string, compareTo: string): boolean {
  const v1 = version.split('.').map(Number);
  const v2 = compareTo.split('.').map(Number);

  // Compare major, minor, and patch versions
  for (let i = 0; i < 3; i++) {
    if (v1[i] < v2[i]) {
      return true;
    } else if (v1[i] > v2[i]) {
      return false;
    }
  }
  return false;
}
