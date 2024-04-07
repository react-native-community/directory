export const pluralize = (text: string, count: number) => {
  return count > 1 || count === 0 ? `${text}s` : text;
};

export const isEmptyOrNull = (text?: string | null) => {
  return !text || !text.trim();
};
