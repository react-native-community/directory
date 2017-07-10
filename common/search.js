export const handleFilterLibraries = ({ libraries, topic, search }) => {
  return libraries.filter(library => {
    return library.topicSearchString.includes(topic);
  });
};
