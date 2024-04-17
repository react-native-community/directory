export const pluralize = (text, count) => {
  return count > 1 || count === 0 ? `${text}s` : text;
};

export const isEmptyOrNull = text => {
  return !text || !text.trim();
};
