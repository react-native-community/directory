import { type LibraryType } from '~/types';
import { MAX_SCORE, MIN_SCORE, SCORING_CRITERIONS } from '~/util/scoring';

/**
 * Directory Score
 */

export function calculateDirectoryScore(data: LibraryType) {
  // Filter the modifiers to the ones which conditions pass with the data
  const matchingModifiers = SCORING_CRITERIONS.filter(modifier => modifier.condition(data));

  // Reduce the matching modifiers to find the raw score for the data
  const rawScore = matchingModifiers.reduce((currentScore, modifier) => {
    return currentScore + modifier.value;
  }, 0);

  // Scale the raw score as a percentage between the minimum and maximum possible score
  // based on the available modifiers
  const score = rawScore <= 0 ? 0 : Math.min(Math.max(rawScore, MIN_SCORE), MAX_SCORE);

  // Map the modifiers to the name so we can include that in the data
  const matchingModifierNames = matchingModifiers.map(modifier => modifier.name);

  return {
    ...data,
    score,
    matchingScoreModifiers: matchingModifierNames,
  };
}

/**
 * Trending Score
 */

const MIN_MONTHLY_DOWNLOADS = 1000;
const MANY_MONTHLY_DOWNLOADS = 15_000;
const MIN_GITHUB_STARS = 25;
const DATE_NOW = Date.now();
const WEEK_IN_MS = 6048e5;

export function calculatePopularityScore(data: LibraryType) {
  if (!data?.npm || !data.npm?.downloads || !data.npm?.weekDownloads) {
    return {
      ...data,
      popularity: -1,
    };
  }

  const { github, unmaintained } = data;
  const { createdAt, stars } = github.stats;

  const popularityGain = data.npm.weekDownloads / Math.floor(data.npm.downloads / 4.25) / 5;

  if (!Number.isFinite(popularityGain)) {
    return {
      ...data,
      popularity: -1,
    };
  }

  const downloadBonus =
    popularityGain > 0.25 ? (data.npm.downloads > MANY_MONTHLY_DOWNLOADS ? 0.25 : 0) : 0;

  const downloadsPenalty = data.npm.downloads < MIN_MONTHLY_DOWNLOADS ? 0.75 : 0;
  const starsPenalty = stars < MIN_GITHUB_STARS ? 0.25 : 0;
  const unmaintainedPenalty = unmaintained ? 0.75 : 0;
  const freshPackagePenalty = DATE_NOW - new Date(createdAt).getTime() < WEEK_IN_MS ? 0.5 : 0;

  const popularity = Number.parseFloat(
    (
      popularityGain -
      downloadsPenalty -
      unmaintainedPenalty -
      starsPenalty -
      freshPackagePenalty +
      downloadBonus
    ).toFixed(3)
  );

  return {
    ...data,
    popularity,
  };
}
