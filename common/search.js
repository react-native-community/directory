import { isEmptyOrNull } from '../common/strings';

export const handleFilterLibraries = ({ libraries, topic, search }) => {
  return libraries.filter(library => {
    const viewerHasChosenTopic = !isEmptyOrNull(topic);
    const viewerHasTypedSearch = !isEmptyOrNull(search);

    let isTopicMatch = false;
    let isSearchMatch = false;

    if (viewerHasChosenTopic && library.topicSearchString.includes(topic)) {
      isTopicMatch = true;
    }

    if (!viewerHasTypedSearch) {
      return isTopicMatch;
    }

    if (viewerHasTypedSearch) {
      const isTopicMatch = library.topicSearchString.includes(search);
      const isNameMatch = !isEmptyOrNull(library.github.name)
        ? library.github.name.includes(search)
        : undefined;
      const isDescriptionMatch = !isEmptyOrNull(library.github.description)
        ? library.github.description.includes(search)
        : undefined;

      isSearchMatch = isNameMatch || isDescriptionMatch || isTopicMatch;
    }

    if (!viewerHasChosenTopic) {
      return isSearchMatch;
    }

    return isTopicMatch && isSearchMatch;
  });
};
