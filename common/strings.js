export const pluralize = (text: string, count: number) => {
  return count > 1 || count === 0 ? `${text}s` : text;
};

export const elide = string => {
  return string ? `${string.substring(0, 140)}...` : '...';
};

export const isEmptyOrNull = (text: any) => {
  return !text || !text.trim();
};
