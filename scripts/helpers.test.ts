import { describe, expect, test } from 'bun:test';

import { fillNpmDownloads } from '~/scripts/helpers';

const PREVIOUS_NPM_DATA = { downloads: 40_000, weekDownloads: 9000, size: 1234 };

describe('fillNpmDownloads', () => {
  test('keeps fresh download counts', () => {
    expect(
      fillNpmDownloads({ downloads: 50_000, weekDownloads: 12_000 }, PREVIOUS_NPM_DATA)
    ).toEqual({ downloads: 50_000, weekDownloads: 12_000 });
  });

  test('falls back to previous download counts when fresh data is missing', () => {
    expect(fillNpmDownloads(null, PREVIOUS_NPM_DATA)).toEqual({
      downloads: 40_000,
      weekDownloads: 9000,
    });
    expect(fillNpmDownloads({ size: 999 }, PREVIOUS_NPM_DATA)).toEqual({
      size: 999,
      downloads: 40_000,
      weekDownloads: 9000,
    });
  });

  test('stays empty without fresh or previous download counts', () => {
    expect(fillNpmDownloads(null)).toEqual({});
    expect(fillNpmDownloads(undefined, { size: 1234 })).toEqual({});
  });
});
