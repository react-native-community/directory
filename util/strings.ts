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

export function getExampleDescription(url: string) {
  if (url.includes('github.com')) {
    if (url.includes('/tree/')) {
      return `GitHub project (${url.split('/').reverse()[0]})`;
    }
    return 'GitHub repository example';
  }
  if (url.includes('snack.expo.dev')) {
    return 'Snack';
  }
  return 'Code example';
}
