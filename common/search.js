import { isEmptyOrNull } from '../common/strings';

export const handleTopicSorting = ({ data, topic, search }) => {
  return data.filter(e => {
    let isTopicMatch;

    e.github.topics.forEach(t => {
      if (t.includes(topic)) {
        isTopicMatch = true;
      }
    });

    if (!isEmptyOrNull(search)) {
      const isNameMatch = e.github.name.includes(search);
      const isDescriptionMatch = !isEmptyOrNull(e.github.description)
        ? e.github.description.includes(search)
        : undefined;

      return isTopicMatch && (isNameMatch || isDescriptionMatch);
    }

    return isTopicMatch;
  });
};

export const handleSearchSorting = ({ data, search }) => {
  return data.filter(e => {
    if (isEmptyOrNull(search)) {
      return true;
    }

    const isNameMatch = e.github.name.includes(search);
    const isDescriptionMatch = !isEmptyOrNull(e.github.description)
      ? e.github.description.includes(search)
      : undefined;

    let isTopicMatch;
    e.github.topics.forEach(t => {
      if (t.includes(search)) {
        isTopicMatch = true;
      }
    });

    return isNameMatch || isTopicMatch || isDescriptionMatch;
  });
};
