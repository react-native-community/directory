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

export function formatNumberToString(quantity: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(quantity);
}

export function formatPackageManager(pmRaw?: string) {
  if (!pmRaw) {
    return undefined;
  }

  if (pmRaw.includes('bun')) {
    return 'Bun';
  } else if (pmRaw.includes('pnpm')) {
    return 'pnpm';
  } else if (pmRaw.includes('npm')) {
    return 'npm';
  } else if (pmRaw.includes('yarn')) {
    if (pmRaw.includes('@1')) {
      return 'Yarn Classic';
    } else if (pmRaw.includes('@')) {
      return 'Yarn Berry';
    }
    return 'Yarn';
  }
}
