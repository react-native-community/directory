import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';

import { TimeRange } from '~/util/datetime';

const BOOKMARK_COOKIE_NAME = 'rnd_bookmarks';
const COOKIE_MAX_AGE = TimeRange.YEAR;

type BookmarksContextType = {
  bookmarkedIds: Set<string>;
  checkIsBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string) => void;
  isLoading: boolean;
};

const BookmarksContext = createContext<BookmarksContextType | null>(null);

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document === 'undefined') {
    return;
  }
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getBookmarksFromCookie(cookieString?: string): string[] {
  if (typeof cookieString === 'string') {
    const match = cookieString.match(new RegExp(`(^| )${BOOKMARK_COOKIE_NAME}=([^;]+)`));
    if (match) {
      try {
        return JSON.parse(decodeURIComponent(match[2]));
      } catch {
        return [];
      }
    }
    return [];
  }

  const value = getCookie(BOOKMARK_COOKIE_NAME);
  if (!value) {
    return [];
  }
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

export function BookmarksProvider({ children }: PropsWithChildren) {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bookmarks = getBookmarksFromCookie();
    setBookmarkedIds(new Set(bookmarks));
    setIsLoading(false);
  }, []);

  function checkIsBookmarked(id: string) {
    return bookmarkedIds.has(id);
  }

  function toggleBookmark(id: string) {
    const newSet = new Set(bookmarkedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }

    setCookie(BOOKMARK_COOKIE_NAME, JSON.stringify([...newSet]), COOKIE_MAX_AGE);
    setBookmarkedIds(newSet);
  }

  return (
    <BookmarksContext.Provider
      value={{ bookmarkedIds, checkIsBookmarked, toggleBookmark, isLoading }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
}
