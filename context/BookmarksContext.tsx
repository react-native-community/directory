import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';

const BOOKMARK_KEY = '@ReactNativeDirectory:BookmarkedLibraries';

type BookmarksContextType = {
  bookmarkedIds: Set<string>;
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string) => Promise<void>;
  isLoading: boolean;
};

const BookmarksContext = createContext<BookmarksContextType | null>(null);

export function BookmarksProvider({ children }: PropsWithChildren) {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBookmarks() {
      try {
        const stored = await AsyncStorage.getItem(BOOKMARK_KEY);
        if (stored) {
          const parsed: string[] = JSON.parse(stored);
          setBookmarkedIds(new Set(parsed));
        }
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadBookmarks();
  }, []);

  const isBookmarked = (id: string) => bookmarkedIds.has(id);

  const toggleBookmark = async (id: string) => {
    try {
      const newSet = new Set(bookmarkedIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      
      await AsyncStorage.setItem(BOOKMARK_KEY, JSON.stringify([...newSet]));
      setBookmarkedIds(newSet);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  return (
    <BookmarksContext.Provider value={{ bookmarkedIds, isBookmarked, toggleBookmark, isLoading }}>
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
