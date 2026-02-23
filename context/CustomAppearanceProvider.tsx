import { type PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { type RnColorScheme } from 'twrnc';

import tw, { useAppColorScheme, useDeviceContext } from '~/util/tailwind';

import CustomAppearanceContext from './CustomAppearanceContext';

const appearanceStorageKey = '@ReactNativeDirectory:CustomAppearanceContext';
const defaultState = { isDark: false };

export default function CustomAppearanceProvider({ children }: PropsWithChildren) {
  const [colorScheme, , setColorScheme] = useAppColorScheme(tw);
  const colorSchemeRef = useRef<RnColorScheme>(colorScheme);
  const initialScheme = useMemo<RnColorScheme>(() => (readIsDarkFromLS() ? 'dark' : 'light'), []);

  useEffect(() => {
    applyTheme(initialScheme);
  }, [initialScheme]);

  useEffect(() => {
    colorSchemeRef.current = colorScheme;
  }, [colorScheme]);

  useDeviceContext(tw, {
    observeDeviceColorSchemeChanges: false,
    initialColorScheme: initialScheme ?? 'light',
  });

  function toggleTheme() {
    const newTheme: RnColorScheme = colorSchemeRef.current === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    setColorScheme(newTheme);
    writeIsDarkToLS(newTheme === 'dark');
  }

  return (
    <CustomAppearanceContext.Provider key={colorScheme} value={{ toggleTheme }}>
      {children}
    </CustomAppearanceContext.Provider>
  );
}

function applyTheme(scheme: RnColorScheme) {
  if (scheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function readIsDarkFromLS(): boolean {
  try {
    const raw = window.localStorage.getItem(appearanceStorageKey);
    if (!raw) {
      return defaultState.isDark;
    }
    const { isDark } = JSON.parse(raw);
    return isDark ?? defaultState.isDark;
  } catch {
    return defaultState.isDark;
  }
}

function writeIsDarkToLS(isDark: boolean) {
  window.localStorage.setItem(appearanceStorageKey, JSON.stringify({ isDark }));
}
