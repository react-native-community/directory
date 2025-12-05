import { type LibraryType, type ScoringCriterionType } from '~/types';

// This is an array of modifier objects. Each modifier has a name, value, and condition.
// The data is passed to the `condition` function, and if it returns `true`, the value is added to the
// library score. Read more: https://reactnative.directory/scoring
export const SCORING_CRITERIONS: ScoringCriterionType[] = [
  {
    name: 'Very popular',
    description: 'Libraries with a Combined Popularity score of over 50,000 meet this criterion.',
    value: 35,
    condition: data => getCombinedPopularity(data) > 50000,
  },
  {
    name: 'Popular',
    description: 'Libraries with a Combined Popularity score of over 10,000 meet this criterion',
    value: 25,
    condition: data => getCombinedPopularity(data) > 10000,
  },
  {
    name: 'Known',
    description: 'Libraries with a Combined Popularity score of over 2,500 meet this criterion.',
    value: 15,
    condition: data => getCombinedPopularity(data) > 2500,
  },
  {
    name: 'Recently updated',
    description: 'Libraries that have been updated in the last 45 days meet this criterion.',
    value: 10,
    condition: data => getUpdatedDaysAgo(data) <= 45, // Roughly 1.5 month
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
    name: 'Not updated recently',
    description: 'Libraries that have not been updated in the last 180 days meet this criterion.',
    value: -10,
    condition: data => getUpdatedDaysAgo(data) >= 180, // Roughly 6 months
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
      if (data.dev || data.template || data.expoGo) {
        return false;
      }

      if (data.newArchitecture !== undefined) {
        return !data.newArchitecture;
      }

      return data.github.newArchitecture !== true;
    },
  },
  {
    name: 'Lots of open issues',
    description: 'Libraries with more than 50 open issues meet this criterion.',
    value: -15,
    condition: data => data.github.stats.issues >= 50,
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

const DAY_IN_MS = 864e5;

function getCombinedPopularity({ github, npm }: LibraryType) {
  const { subscribers, forks, stars } = github.stats;
  return subscribers * 50 + forks * 25 + stars * 10 + (npm?.downloads ?? 0) / 100;
}

function getUpdatedDaysAgo(data: LibraryType) {
  const { updatedAt } = data.github.stats;
  const updateDate = new Date(updatedAt).getTime();
  const currentDate = new Date().getTime();

  return (currentDate - updateDate) / DAY_IN_MS;
}
