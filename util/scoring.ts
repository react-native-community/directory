import { type LibraryType, type ScoringCriterionType } from '~/types';

export function getCombinedPopularity({ github, npm }: LibraryType) {
  const { forks, stars } = github.stats;
  return forks * 20 + stars * 10 + (npm?.downloads ?? 0) / 50;
}

// This is an array of modifier objects. Each modifier has a name, value, and condition.
// The data is passed to the `condition` function, and if it returns `true`, the value is added to the
// library score. Read more: https://reactnative.directory/scoring
export const SCORING_CRITERIONS: ScoringCriterionType[] = [
  {
    name: 'Very popular',
    description: 'Libraries with a Combined Popularity score of over 100,000 meet this criterion.',
    value: 40,
    condition: data => getCombinedPopularity(data) > 100_000,
  },
  {
    name: 'Popular',
    description: 'Libraries with a Combined Popularity score of over 10,000 meet this criterion',
    value: 20,
    condition: data => getCombinedPopularity(data) > 10_000,
  },
  {
    name: 'Known',
    description: 'Libraries with a Combined Popularity score of over 2,500 meet this criterion.',
    value: 10,
    condition: data => getCombinedPopularity(data) > 2500,
  },
  {
    name: 'Recently updated',
    description: 'Libraries that have been updated in the last 60 days meet this criterion.',
    value: 10,
    condition: data => getUpdatedDaysAgo(data) <= 60, // Roughly 2 months
  },
  {
    name: 'Has a README file',
    description: 'Libraries that have a README file included meet this criterion.',
    value: 10,
    condition: data => data.github?.hasReadme ?? data.npm?.hasReadme ?? false,
  },
  {
    name: 'Has a description',
    description:
      'Libraries that have a description defined in package.json file meet this criterion.',
    value: 5,
    condition: data => !!data.github.description && data.github.description.trim().length > 0,
  },
  {
    name: 'Has vulnerability alerts enabled',
    description:
      'Libraries with enabled vulnerability alerts in their GitHub repository meet this criterion.',
    value: 5,
    condition: data => data.github.stats.hasVulnerabilityAlerts,
  },
  {
    name: 'New Architecture support unknown',
    description:
      'Libraries that does not have New Architecture support defined or confirmed by the code analysis meet this criterion.',
    value: -5,
    condition: data => {
      if (data.dev || data.template || data.expoGo) {
        return false;
      }

      return data.newArchitecture === undefined && data.github.newArchitecture === false;
    },
  },
  {
    name: 'Not updated recently',
    description: 'Libraries that have not been updated in the last 180 days meet this criterion.',
    value: -10,
    condition: data => getUpdatedDaysAgo(data) >= 180, // Roughly 6 months
  },
  {
    name: 'Lots of open issues',
    description:
      'Libraries with more than 100 open issues with at least 1000 stars, or 50 open issues otherwise meet this criterion.',
    value: -10,
    condition: data => data.github.stats.issues >= (data.github.stats.stars > 1000 ? 100 : 50),
  },
  {
    name: 'Has a lot of dependencies',
    description: 'Libraries that use at least 25 or more direct dependencies meet this criterion.',
    value: -10,
    condition: data =>
      data.github.stats.dependencies ? data.github.stats.dependencies > 25 : false,
  },
  {
    name: 'Not supporting New Architecture',
    description: 'Libraries that does not support New Architecture meet this criterion.',
    value: -15,
    condition: data => {
      if (data.dev || data.template) {
        return false;
      }

      return data.newArchitecture === false;
    },
  },
  {
    name: 'No license, GPL license or unrecognized license',
    description:
      'Libraries without a license, libraries with non-standard license or that include the GPL license meet this criterion.',
    value: -20,
    condition: data => {
      if (!data.github.license || !data.github.license.key) {
        return true;
      }

      return (
        data.github.license.key.startsWith('gpl') || data.github.license.key.startsWith('other')
      );
    },
  },
  {
    name: 'Unmaintained',
    description:
      'Libraries that are archived on GitHub, deprecated on npm registry, or marked as unmaintained due to lack of activity in last two years.',
    value: -30,
    condition: data => data?.unmaintained ?? false,
  },
];

export const MAX_SCORE = SCORING_CRITERIONS.reduce((currentMax, modifier) => {
  return modifier.value > 0 ? currentMax + modifier.value : currentMax;
}, 0);

export const MIN_SCORE =
  MAX_SCORE +
  SCORING_CRITERIONS.reduce((currentMin, modifier) => {
    return modifier.value < 0 ? currentMin + modifier.value : currentMin;
  }, 0);

const DAY_IN_MS = 864e5;

function getUpdatedDaysAgo(data: LibraryType) {
  const { updatedAt } = data.github.stats;
  const updateDate = new Date(updatedAt).getTime();
  const currentDate = Date.now();

  return (currentDate - updateDate) / DAY_IN_MS;
}

export function getPopularityGrade(popularity: number) {
  if (popularity > 0.5) {
    return 'HOT!';
  } else if (popularity > 0.25) {
    return 'Popular';
  } else if (popularity > 0.1) {
    return 'Quite popular';
  } else if (popularity > 0) {
    return 'Trending';
  } else {
    return 'Declining';
  }
}
