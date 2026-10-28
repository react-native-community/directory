import { describe, expect, it, mock } from 'bun:test';

import { type LibraryType } from '~/types';

const GITHUB_URL = 'https://github.com/apolyanov/impulse-ui-native/tree/main/packages/toolkit';

function createGitHubResponse(packageJson: Record<string, unknown>) {
  return {
    url: 'https://github.com/apolyanov/impulse-ui-native',
    nameWithOwner: 'apolyanov/impulse-ui-native',
    description: null,
    homepageUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
    isArchived: false,
    hasIssuesEnabled: true,
    hasWikiEnabled: false,
    hasProjectsEnabled: false,
    hasSponsorshipsEnabled: false,
    hasDiscussionsEnabled: false,
    hasVulnerabilityAlertsEnabled: false,
    issues: { totalCount: 0 },
    watchers: { totalCount: 0 },
    stargazerCount: 0,
    forkCount: 0,
    repositoryTopics: { nodes: [] },
    files: { entries: [] },
    rootFiles: { entries: [] },
    packageJson: { text: JSON.stringify(packageJson) },
    defaultBranchRef: {
      target: {
        history: { nodes: [{ committedDate: '2026-01-01T00:00:00Z' }] },
      },
    },
  };
}

let gitHubResponse = createGitHubResponse({});

mock.module('./helpers', () => ({
  REQUEST_SLEEP: 0,
  getUpdatedUrl: async (url: string) => url,
  makeGraphqlQuery: async () => ({ data: { repository: gitHubResponse } }),
  processTopics: (topics?: string[]) => (Array.isArray(topics) ? topics : []),
  sleep: async () => {},
}));

const { fetchGithubData } = await import('./fetch-github-data');

async function dependenciesCountFor(packageJson: Record<string, unknown>, githubUrl = GITHUB_URL) {
  gitHubResponse = createGitHubResponse(packageJson);
  const result = await fetchGithubData({ githubUrl } as LibraryType);
  return result.github.stats.dependencies;
}

describe('dependency counting', () => {
  it('excludes dependencies that share the package scope', async () => {
    const dependencies = Object.fromEntries([
      ...Array.from({ length: 26 }, (_, index) => [`@impulse-ui-native/dep-${index}`, '^1.0.0']),
      ['react', '*'],
      ['react-native', '*'],
      ['lodash-es', '^4.0.0'],
    ]);

    expect(
      await dependenciesCountFor({
        name: '@impulse-ui-native/toolkit',
        dependencies,
      })
    ).toBe(3);
  });

  it('counts dependencies from a different scope', async () => {
    expect(
      await dependenciesCountFor({
        name: '@scope/lib',
        dependencies: {
          '@scope/a': '^1.0.0',
          '@scope-extra/b': '^1.0.0',
          react: '*',
        },
      })
    ).toBe(2);
  });

  it('keeps all dependencies for unscoped packages', async () => {
    expect(
      await dependenciesCountFor({
        name: 'example-lib',
        dependencies: {
          '@scope/a': '^1.0.0',
          react: '*',
          'lodash-es': '^4.0.0',
        },
      })
    ).toBe(3);
  });

  it('returns zero when package.json has no dependencies', async () => {
    expect(await dependenciesCountFor({ name: '@impulse-ui-native/toolkit' })).toBe(0);
  });

  it('counts all dependencies when package.json has no name', async () => {
    expect(
      await dependenciesCountFor({
        dependencies: { react: '*', 'lodash-es': '^4.0.0' },
      })
    ).toBe(2);
  });

  it('counts all dependencies when package name is not a string', async () => {
    expect(
      await dependenciesCountFor({
        name: 123,
        dependencies: { react: '*', 'lodash-es': '^4.0.0' },
      })
    ).toBe(2);
  });

  it('excludes same-scope dependencies for non-monorepo packages', async () => {
    expect(
      await dependenciesCountFor(
        {
          name: '@scope/lib',
          dependencies: {
            '@scope/a': '^1.0.0',
            '@scope/b': '^1.0.0',
            react: '*',
          },
        },
        'https://github.com/owner/lib'
      )
    ).toBe(1);
  });
});
