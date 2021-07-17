import { isEmptyOrNull } from './strings';

const calculateMatchScore = ({ github, npmPkg, topicSearchString }, querySearch) => {
  const isRepoNameMatch = !isEmptyOrNull(github.name) && github.name.includes(querySearch);
  const isNpmPkgNameMatch = !isEmptyOrNull(npmPkg) && npmPkg.includes(querySearch);
  const isNameMatch = isRepoNameMatch || isNpmPkgNameMatch ? 100 : 0;
  const isDescriptionMatch =
    !isEmptyOrNull(github.description) && github.description.toLowerCase().includes(querySearch)
      ? 10
      : 0;
  const isTopicMatch = topicSearchString.includes(querySearch) ? 1 : 0;
  return isNameMatch + isDescriptionMatch + isTopicMatch;
};

export const handleFilterLibraries = ({
  libraries,
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
}) => {
  const viewerHasChosenTopic = !isEmptyOrNull(queryTopic);
  const viewerHasTypedSearch = !isEmptyOrNull(querySearch);

  const processedLibraries = viewerHasTypedSearch
    ? libraries.map(library => ({
        ...library,
        matchScore: calculateMatchScore(library, querySearch),
      }))
    : libraries;

  return processedLibraries.filter(library => {
    let isTopicMatch = false;
    let isSearchMatch = false;

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

    if (support.expo && !library.expo) {
      return false;
    }

    if (support.expo && typeof library.expo === 'string') {
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

    if (isMaintained && library.unmaintained) {
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

    if (minPopularity) {
      return library.popularity * 100 >= parseFloat(minPopularity);
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
};
