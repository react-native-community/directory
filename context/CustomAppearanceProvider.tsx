import { type PropsWithChildren, useEffect, useRef } from 'react';
import { Uniwind } from 'uniwind';

import CustomAppearanceContext from './CustomAppearanceContext';

const appearanceStorageKey = '@ReactNativeDirectory:CustomAppearanceContext';
const defaultState = { isDark: false };

export default function CustomAppearanceProvider({ children }: PropsWithChildren) {
  const colorSchemeRef = useRef<'dark' | 'light' | undefined>(undefined);
  const initialScheme = readStoredAppearance() ? 'dark' : 'light';

  useEffect(() => {
    Uniwind.setTheme(initialScheme);
    colorSchemeRef.current = initialScheme;
  }, [initialScheme]);

  const value = {
    toggleTheme: () => {
      const currentTheme = colorSchemeRef.current ?? Uniwind.currentTheme;
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      colorSchemeRef.current = newTheme;
      Uniwind.setTheme(newTheme);
      writeAppearanceToStore(newTheme === 'dark');
    },
  };

  return (
    <CustomAppearanceContext.Provider value={value}>{children}</CustomAppearanceContext.Provider>
  );
}

function readStoredAppearance(): boolean {
  try {
    const item = window.localStorage.getItem(appearanceStorageKey);
    return item ? (JSON.parse(item)?.isDark ?? defaultState.isDark) : defaultState.isDark;
  } catch {
    return defaultState.isDark;
  }
}

function writeAppearanceToStore(isDark: boolean) {
  window.localStorage.setItem(appearanceStorageKey, JSON.stringify({ isDark }));
}
