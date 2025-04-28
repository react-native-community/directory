import { Library, Query } from '~/types';

import { getNewArchSupportStatus, NewArchSupportStatus } from './newArchStatus';
import { relevance } from './sorting';
import { isEmptyOrNull } from './strings';

const NPM_NAME_CLEANUP_REGEX = /[-/]/g;
const GITHUB_URL_CLEANUP_REGEX =
  /^https?:\/\/(?:www\.)?github\.com\/([^/]+\/[^/]+)(?:$|\/|\.git).*$/;

function calculateMatchScore(
  { github, npmPkg, topicSearchString, unmaintained, githubUrl }: Library,
  querySearch: string
) {
  const exactNameMatchPoints =
    (!isEmptyOrNull(github.name) && github.name === querySearch) ||
    (!isEmptyOrNull(npmPkg) && npmPkg === querySearch)
      ? 300
      : 0;

  const npmPkgNameMatchPoints =
    !isEmptyOrNull(npmPkg) &&
    (npmPkg.includes(querySearch) ||
      npmPkg.replaceAll(NPM_NAME_CLEANUP_REGEX, ' ').includes(querySearch))
      ? 200
      : 0;

  const gitHubURLOrOwnerMatchPoints =
    githubUrl.startsWith(querySearch) ||
    githubUrl.replace(GITHUB_URL_CLEANUP_REGEX, '$1').includes(querySearch)
      ? 150
      : 0;

  const cleanedUpName = npmPkg
    .replace('react-native', '')
    .replace('react', '')
    .replaceAll(/[-/]/g, ' ')
    .trim();

  const cleanedUpNameMatchPoints =
    !isEmptyOrNull(cleanedUpName) &&
    (cleanedUpName.includes(querySearch) ||
      cleanedUpName.includes(querySearch.replaceAll(NPM_NAME_CLEANUP_REGEX, ' ')))
      ? 100
      : 0;

  const repoNameMatchPoints =
    !isEmptyOrNull(github.name) && github.name.includes(querySearch) ? 50 : 0;

  const descriptionMatchPoints =
    !isEmptyOrNull(github.description) && github.description.toLowerCase().includes(querySearch)
      ? 25
      : 0;

  const topicMatchPoints = topicSearchString.includes(querySearch) ? 10 : 0;

  const matchScore =
    exactNameMatchPoints +
    repoNameMatchPoints +
    cleanedUpNameMatchPoints +
    npmPkgNameMatchPoints +
    gitHubURLOrOwnerMatchPoints +
    descriptionMatchPoints +
    topicMatchPoints;

  if (matchScore && unmaintained) {
    return matchScore / 1000;
  } else {
    return matchScore;
  }
}

export function handleFilterLibraries({
  libraries,
  sortBy,
  queryTopic,
  querySearch,
  support,
  hasExample,
  hasImage,
  hasTypes,
  isMaintained,
  isPopular,
  isRecommended,
  wasRecentlyUpdated,
  minPopularity,
  minMonthlyDownloads,
  newArchitecture,
  skipLibs,
  skipTools,
  skipTemplates,
}) {
  const viewerHasChosenTopic = !isEmptyOrNull(queryTopic);
  const viewerHasTypedSearch = !isEmptyOrNull(querySearch);

  const minPopularityValue = minPopularity && parseFloat(minPopularity) / 100;
  const minMonthlyDownloadsValue = minMonthlyDownloads && parseInt(minMonthlyDownloads, 10);

  const processedLibraries = viewerHasTypedSearch
    ? libraries.map(library => ({
        ...library,
        matchScore: calculateMatchScore(library, querySearch),
      }))
    : libraries;

  const filteredLibraries = processedLibraries.filter(library => {
    let isTopicMatch = false;
    let isSearchMatch = false;

    if (skipLibs && !library.dev && !library.template) {
      return false;
    }

    if (skipTools && library.dev) {
      return false;
    }

    if (skipTemplates && library.template) {
      return false;
    }

    if (support.ios && !library.ios) {
      return false;
    }

    if (support.android && !library.android) {
      return false;
    }

    if (support.web && !library.web) {
      return false;
    }

    if (support.windows && !library.windows) {
      return false;
    }

    if (support.macos && !library.macos) {
      return false;
    }

    if (support.tvos && !library.tvos) {
      return false;
    }

    if (support.visionos && !library.visionos) {
      return false;
    }

    if (support.fireos && !library.fireos) {
      return false;
    }

    if (support.expoGo && !library.expoGo) {
      return false;
    }

    if (support.expoGo && typeof library.expoGo === 'string') {
      return false;
    }

    if (hasExample && (!library.examples || !library.examples.length)) {
      return false;
    }

    if (hasImage && (!library.images || !library.images.length)) {
      return false;
    }

    if (hasTypes && !library.github.hasTypes) {
      return false;
    }

    const newArchStatus = getNewArchSupportStatus(library);

    if (
      newArchitecture === 'true' &&
      [NewArchSupportStatus.Unsupported, NewArchSupportStatus.Untested].includes(newArchStatus)
    ) {
      return false;
    }

    if (
      newArchitecture === 'false' &&
      [NewArchSupportStatus.Supported, NewArchSupportStatus.Untested].includes(newArchStatus)
    ) {
      return false;
    }

    if (
      newArchitecture === 'untested' &&
      [NewArchSupportStatus.Supported, NewArchSupportStatus.Unsupported].includes(newArchStatus)
    ) {
      return false;
    }

    if (isMaintained === 'false' && !library.unmaintained) {
      return false;
    }

    if (isMaintained === 'true' && library.unmaintained) {
      return false;
    }

    if (isPopular && !library.matchingScoreModifiers.includes('Popular')) {
      return false;
    }

    if (isRecommended && !library.matchingScoreModifiers.includes('Recommended')) {
      return false;
    }

    if (wasRecentlyUpdated && !library.matchingScoreModifiers.includes('Recently updated')) {
      return false;
    }

    if (minPopularityValue && minMonthlyDownloadsValue) {
      return (
        library.popularity >= minPopularityValue &&
        library.npm.downloads >= minMonthlyDownloadsValue
      );
    } else if (minPopularityValue) {
      return library.popularity >= minPopularityValue;
    } else if (minMonthlyDownloadsValue) {
      return library.npm.downloads >= minMonthlyDownloadsValue;
    }

    if (!viewerHasChosenTopic && !viewerHasTypedSearch) {
      return true;
    }

    if (viewerHasChosenTopic && library.topicSearchString.includes(queryTopic)) {
      isTopicMatch = true;
    }

    if (!viewerHasTypedSearch) {
      return isTopicMatch;
    }

    if (viewerHasTypedSearch) {
      isSearchMatch = library.matchScore && library.matchScore > 0;
    }

    if (!viewerHasChosenTopic) {
      return isSearchMatch;
    }

    return isTopicMatch && isSearchMatch;
  });

  if (sortBy === 'relevance') {
    return relevance(filteredLibraries);
  }

  return filteredLibraries;
}

export function getPageQuery(basePath: string, query: Query) {
  if (basePath === '/trending') {
    return { ...query, minPopularity: undefined, order: undefined };
  }
  return query;
}
