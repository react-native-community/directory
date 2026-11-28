import { afterEach, beforeEach, describe, expect, test } from 'bun:test';

import { getBookmarksFromCookie, saveBookmarksToCookie } from '~/context/BookmarksContext';

// Browsers ignore cookies with name and value longer than 4096 bytes
const COOKIE_SIZE_LIMIT = 4096;

function installCookieJar() {
  const jar = new Map<string, string>();

  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      get cookie() {
        return [...jar].map(([name, value]) => `${name}=${value}`).join('; ');
      },
      set cookie(cookie: string) {
        const [pair] = cookie.split(';');
        const separatorIndex = pair.indexOf('=');

        if (pair.length > COOKIE_SIZE_LIMIT) {
          return;
        }

        jar.set(pair.slice(0, separatorIndex), pair.slice(separatorIndex + 1));
      },
    },
  });
}

function createPackageNames(count: number) {
  return new Set(
    Array.from({ length: count }, (_, index) => `@some-scope/react-native-package-${index}`)
  );
}

describe('saveBookmarksToCookie', () => {
  beforeEach(installCookieJar);

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'document');
  });

  test('saves bookmarks which fit in the cookie', () => {
    const bookmarks = createPackageNames(10);

    expect(saveBookmarksToCookie(bookmarks)).toBe(true);
    expect(getBookmarksFromCookie()).toEqual([...bookmarks]);
  });

  test('reports a failed save and keeps previous bookmarks when cookie is too large', () => {
    const bookmarks = createPackageNames(10);
    saveBookmarksToCookie(bookmarks);

    expect(saveBookmarksToCookie(createPackageNames(200))).toBe(false);
    expect(getBookmarksFromCookie()).toEqual([...bookmarks]);
  });
});
