export const pluralize = (text, count) => {
  return count > 1 || count === 0 ? `${text}s` : text;
};

export const isEmptyOrNull = text => {
  return !text || !text.trim();
};

export function getLibraryDisplayName(library) {
  return library.nameOverride ?? library.npmPkg ?? library.github.name;
}

export function getExampleDescription(url) {
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
