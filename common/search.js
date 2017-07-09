import { isEmptyOrNull } from '../common/strings';

export const handleFilterLibraries = ({ libraries, topic, search }) => {
  return libraries.filter(library => {
    const viewerHasChosenTopic = !isEmptyOrNull(topic);
    const viewerHasEnteredSearchInput = !isEmptyOrNull(search);

    let isTopicMatch = false;
    let isSearchMatch = false;

    if (library.github.topics) {
      library.github.topics.forEach(t => {
        if (viewerHasChosenTopic && t.includes(topic)) {
          isTopicMatch = true;
        }

        if (viewerHasEnteredSearchInput && t.includes(search)) {
          isSearchMatch = true;
        }
      });
    }

    if (!viewerHasEnteredSearchInput) {
      return isTopicMatch;
    }

    if (viewerHasEnteredSearchInput) {
      const isNameMatch = !isEmptyOrNull(library.github.name)
        ? library.github.name.includes(search)
        : undefined;
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
