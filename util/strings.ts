import { Children, isValidElement, type PropsWithChildren, type ReactNode } from 'react';

export const NUMBER_FORMATTER = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 2,
});

export const FULL_FRACTION_NUMBER_FORMATTER = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function bigNumberFormatter(value: number) {
  if (value < 1000) {
    return NUMBER_FORMATTER.format(value);
  }
  return FULL_FRACTION_NUMBER_FORMATTER.format(value);
}

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
  return !text?.trim();
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

export function childrenToText(children: ReactNode): string {
  return Children.toArray(children)
    .map(child => {
      if (typeof child === 'string' || typeof child === 'number') {
        return String(child);
      }

      if (isValidElement<PropsWithChildren>(child)) {
        return childrenToText(child.props.children);
      }

      return '';
    })
    .join('')
    .replaceAll(/\./g, '')
    .toLowerCase();
}
