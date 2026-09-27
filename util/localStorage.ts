export function getStoredValue(key: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(key);
}

export function getStoredFlagValue(key: string) {
  return typeof window !== 'undefined' && window.localStorage.getItem(key) === 'true';
}
