import { describe, expect, test } from 'bun:test';

import { type LibraryType } from '~/types';
import { getSwiftPMSupport } from '~/util/swiftPMStatus';

function createLibrary(swiftPM?: boolean, hasSwiftPM?: boolean): LibraryType {
  return { swiftPM, github: { hasSwiftPM } } as LibraryType;
}

describe('getSwiftPMSupport', () => {
  test('honors swiftPM true over detected false', () => {
    expect(getSwiftPMSupport(createLibrary(true, false))).toBe(true);
  });

  test('honors swiftPM false over detected true', () => {
    expect(getSwiftPMSupport(createLibrary(false, true))).toBe(false);
  });

  test('uses detected true without an override', () => {
    expect(getSwiftPMSupport(createLibrary(undefined, true))).toBe(true);
  });

  test('uses detected false without an override', () => {
    expect(getSwiftPMSupport(createLibrary(undefined, false))).toBe(false);
  });

  test('defaults to false without an override or detection', () => {
    expect(getSwiftPMSupport(createLibrary(undefined, undefined))).toBe(false);
  });
});
