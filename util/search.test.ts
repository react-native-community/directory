import { describe, expect, test } from 'bun:test';

import { type LibraryType } from '~/types';
import { handleFilterLibraries } from '~/util/search';

function createLibrary(
  npmPkg: string,
  { popularity, downloads, topics }: { popularity: number; downloads: number; topics: string }
): LibraryType {
  const githubUrl = `https://github.com/owner/${npmPkg}`;

  return {
    githubUrl,
    npmPkg,
    github: {
      name: npmPkg,
      fullName: `owner/${npmPkg}`,
      hasNativeCode: false,
      urls: { repo: githubUrl },
      stats: {
        hasIssues: true,
        hasWiki: false,
        hasProjects: false,
        hasSponsorships: false,
        hasDiscussions: false,
        hasVulnerabilityAlerts: false,
        updatedAt: '2026-11-01T00:00:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        pushedAt: '2026-11-01T00:00:00Z',
        issues: 0,
        subscribers: 0,
        stars: 100,
        forks: 0,
      },
      license: { key: 'mit', name: 'MIT License', spdxId: 'MIT', url: '', id: 'mit' },
    },
    npm: { downloads },
    score: 50,
    popularity,
    matchingScoreModifiers: [],
    topicSearchString: topics,
  };
}

const LIBRARIES = [
  createLibrary('react-native-camera-kit', {
    popularity: 0.3,
    downloads: 50_000,
    topics: 'camera',
  }),
  createLibrary('react-native-maps-kit', { popularity: 0.3, downloads: 50_000, topics: 'maps' }),
  createLibrary('react-native-camera-old', {
    popularity: 0.05,
    downloads: 50_000,
    topics: 'camera',
  }),
  createLibrary('react-native-camera-tiny', { popularity: 0.3, downloads: 100, topics: 'camera' }),
];

const TRENDING_FILTERS = { minPopularity: '15', minMonthlyDownloads: '5000' };

function filterNames(query: Parameters<typeof handleFilterLibraries>[0]) {
  return handleFilterLibraries(query).map(library => library.npmPkg);
}

describe('handleFilterLibraries', () => {
  test('applies popularity and downloads thresholds', () => {
    expect(filterNames({ libraries: LIBRARIES, support: {}, ...TRENDING_FILTERS })).toEqual([
      'react-native-camera-kit',
      'react-native-maps-kit',
    ]);
  });

  test('combines popularity thresholds with search query', () => {
    expect(
      filterNames({ libraries: LIBRARIES, support: {}, querySearch: 'camera', ...TRENDING_FILTERS })
    ).toEqual(['react-native-camera-kit']);
  });

  test('combines popularity thresholds with topic', () => {
    expect(
      filterNames({ libraries: LIBRARIES, support: {}, queryTopic: 'maps', ...TRENDING_FILTERS })
    ).toEqual(['react-native-maps-kit']);
  });
});
