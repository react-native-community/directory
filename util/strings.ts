export function pluralize(word: string, count: number) {
  if (count === 1) {
    return word;
  }

  if (/[^aeiou]y$/i.test(word)) {
    return word.replace(/y$/i, 'ies');
  }

  if (/(s|sh|ch|x|z)$/i.test(word)) {
    return `${word}es`;
  }

  return `${word}s`;
}

export function isEmptyOrNull(text?: string) {
  return !text || !text.trim();
}
