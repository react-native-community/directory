import { isEmptyOrNull } from '../common/strings';

export const handleFilterLibraries = ({ libraries, topic, search }) => {
  return libraries.filter(library => {
    const viewerHasChosenTopic = !isEmptyOrNull(topic);
    const viewerHasEnteredSearchInput = !isEmptyOrNull(search);

    let isTopicMatch = false;
    let isSearchMatch = false;

    library.github.topics.forEach(t => {
      if (viewerHasChosenTopic && t.includes(topic)) {
        isTopicMatch = true;
      }

      if (viewerHasEnteredSearchInput && t.includes(search)) {
        isSearchMatch = true;
      }
    });

    if (!viewerHasEnteredSearchInput) {
      return isTopicMatch;
    }

    if (viewerHasEnteredSearchInput) {
      const isNameMatch = library.github.name.includes(search);
      const isDescriptionMatch = !isEmptyOrNull(library.github.description)
        ? library.github.description.includes(search)
        : undefined;

      isSearchMatch = isNameMatch || isDescriptionMatch;
    }

    if (!viewerHasChosenTopic) {
      return isSearchMatch;
    }

    return isTopicMatch && isSearchMatch;
  });
};
