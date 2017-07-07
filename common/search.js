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
      const isDescriptionMatch = e.github.description.includes(search);

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
    const isDescriptionMatch = e.github.description.includes(search);

    let isTopicMatch;
    e.github.topics.forEach(t => {
      if (t.includes(search)) {
        isTopicMatch = true;
      }
    });

    return isNameMatch || isTopicMatch || isDescriptionMatch;
  });
};
