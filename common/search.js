import { isEmptyOrNull } from '../common/strings';

export const handleFilterLibraries = ({
  libraries,
  queryTopic,
  querySearch,
}) => {
  const viewerHasChosenTopic = !isEmptyOrNull(queryTopic);
  const viewerHasTypedSearch = !isEmptyOrNull(querySearch);

  return libraries.filter(library => {
    let isTopicMatch = false;
    let isSearchMatch = false;

    if (
      viewerHasChosenTopic &&
      library.topicSearchString.includes(queryTopic)
    ) {
      isTopicMatch = true;
    }

    if (!viewerHasTypedSearch) {
      return isTopicMatch;
    }

    if (viewerHasTypedSearch) {
      const isTopicMatch = library.topicSearchString.includes(querySearch);
      const isNameMatch = !isEmptyOrNull(library.github.name)
        ? library.github.name.includes(querySearch)
        : undefined;
      const isDescriptionMatch = !isEmptyOrNull(library.github.description)
        ? library.github.description.includes(querySearch)
        : undefined;

      isSearchMatch = isNameMatch || isDescriptionMatch || isTopicMatch;
    }

    if (!viewerHasChosenTopic) {
      return isSearchMatch;
    }

    return isTopicMatch && isSearchMatch;
  });
};
