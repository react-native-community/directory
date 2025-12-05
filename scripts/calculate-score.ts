import { type LibraryType } from '~/types';
import { SCORING_CRITERIONS } from '~/util/scoring';

/**
 * Directory Score
 */

// Calculate the minimum and maximum possible scores based on the modifiers
const minScore =
  100 +
  SCORING_CRITERIONS.reduce((currentMin, modifier) => {
    return modifier.value < 0 ? currentMin + modifier.value : currentMin;
  }, 0);

const maxScore = SCORING_CRITERIONS.reduce((currentMax, modifier) => {
  return modifier.value > 0 ? currentMax + modifier.value : currentMax;
}, 0);

export function calculateDirectoryScore(data: LibraryType) {
  // Filter the modifiers to the ones which conditions pass with the data
  const matchingModifiers = SCORING_CRITERIONS.filter(modifier => modifier.condition(data));

  // Reduce the matching modifiers to find the raw score for the data
  const rawScore = matchingModifiers.reduce((currentScore, modifier) => {
    return currentScore + modifier.value;
  }, 0);

  // Scale the raw score as a percentage between the minimum and maximum possible score
  // based on the available modifiers
  const score = Math.min(Math.max(rawScore, minScore), maxScore);

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
const MANY_MONTHLY_DOWNLOADS = 15000;
const MIN_GITHUB_STARS = 25;
const DATE_NOW = Date.now();
const WEEK_IN_MS = 6048e5;

export function calculatePopularityScore(data: LibraryType) {
  const { npm, github, unmaintained } = data;

  if (!npm?.downloads || !npm?.weekDownloads) {
    return {
      ...data,
      popularity: -1,
    };
  }

  const { createdAt, stars } = github.stats;
  const { downloads, weekDownloads } = npm;

  const popularityGain = weekDownloads / Math.floor(downloads / 4.25) / 5;

  if (!Number.isFinite(popularityGain)) {
    return {
      ...data,
      popularity: -1,
    };
  }

  const downloadBonus = popularityGain > 0.25 ? (downloads > MANY_MONTHLY_DOWNLOADS ? 0.25 : 0) : 0;

  const downloadsPenalty = downloads < MIN_MONTHLY_DOWNLOADS ? 0.75 : 0;
  const starsPenalty = stars < MIN_GITHUB_STARS ? 0.25 : 0;
  const unmaintainedPenalty = unmaintained ? 0.75 : 0;
  const freshPackagePenalty = DATE_NOW - new Date(createdAt).getTime() < WEEK_IN_MS ? 0.5 : 0;

  const popularity = parseFloat(
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
