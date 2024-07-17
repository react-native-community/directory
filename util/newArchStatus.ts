import { Library } from '../types';

export enum NewArchSupportStatus {
  Supported = 'supported',
  Unsupported = 'unsupported',
  Untested = 'untested',
}

export function getNewArchSupportStatus({ newArchitecture, github }: Library) {
  const hasNote = typeof newArchitecture === 'string';
  if (hasNote) {
    return NewArchSupportStatus.Supported;
  }

  const flag =
    newArchitecture !== undefined
      ? newArchitecture
      : github.newArchitecture === true
        ? true
        : undefined;

  switch (flag) {
    case true:
      return NewArchSupportStatus.Supported;
    case false:
      return NewArchSupportStatus.Unsupported;
    default:
      return NewArchSupportStatus.Untested;
  }
}
