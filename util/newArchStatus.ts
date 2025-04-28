import { Library } from '~/types';

export enum NewArchSupportStatus {
  Supported = 'supported',
  Unsupported = 'unsupported',
  Untested = 'untested',
}

export function getNewArchSupportStatus({ newArchitecture, github, expoGo }: Library) {
  // Assume untested unless indicated otherwise through one of the following tests
  let flag: boolean | string | undefined = undefined;

  if (typeof newArchitecture !== 'undefined') {
    flag = newArchitecture;
  } else if (github.newArchitecture === true) {
    flag = true;
  } else if (expoGo === true) {
    // If the library is an Expo Go library, we consider it as supporting New Architecture because
    // it is either part of the Expo SDK (and therefore supports it) or it is a JS library that
    // does not depend on custom native code. In any cases where this doesn't prove to be true,
    // we can override it with the newArchitecture field.
    flag = true;
  }

  switch (flag) {
    case true:
      return NewArchSupportStatus.Supported;
    case false:
      return NewArchSupportStatus.Unsupported;
    default:
      return NewArchSupportStatus.Untested;
  }
}
