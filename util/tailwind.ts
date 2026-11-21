import { twMerge } from 'tailwind-merge';
import { useUniwind } from 'uniwind';

type ClassNameValue = string | false | null | undefined | ClassNameValue[];

export function cx(...values: ClassNameValue[]) {
  const classes: string[] = [];

  function add(value: ClassNameValue) {
    if (Array.isArray(value)) {
      value.forEach(add);
    } else if (value) {
      classes.push(value);
    }
  }

  values.forEach(add);
  return twMerge(classes.join(' '));
}

export function useIsDark() {
  return useUniwind().theme === 'dark';
}
