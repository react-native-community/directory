import AsyncStorage from '@react-native-async-storage/async-storage';
import { type PropsWithChildren, useEffect, useRef } from 'react';
import { type RnColorScheme } from 'twrnc';

import tw, { useDeviceContext, useAppColorScheme } from '~/util/tailwind';

import CustomAppearanceContext from './CustomAppearanceContext';

const appearanceStorageKey = '@ReactNativeDirectory:CustomAppearanceContext';
const shouldRehydrate = true;
const defaultState = { isDark: false };

export default function CustomAppearanceProvider({ children }: PropsWithChildren) {
  const [colorScheme, , setColorScheme] = useAppColorScheme(tw);
  const colorSchemeRef = useRef<RnColorScheme>(colorScheme);

  useEffect(() => {
    colorSchemeRef.current = colorScheme;
  }, [colorScheme]);

  function applyTheme(scheme: string) {
    if (scheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function toggleTheme() {
    const newTheme = colorSchemeRef.current === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    setColorScheme(newTheme);
    void cacheAppearanceState(newTheme === 'dark');
  }

  useDeviceContext(tw, {
    observeDeviceColorSchemeChanges: false,
    initialColorScheme: colorScheme === 'dark' ? 'dark' : 'light',
  });

  useEffect(() => {
    async function rehydrateAsync() {
      try {
        const { isDark } = await rehydrateAppearanceState();
        if (isDark) {
          applyTheme('dark');
          setColorScheme('dark');
        }
      } catch {}
    }

    void rehydrateAsync();
  }, []); // oxlint-disable-line react/exhaustive-deps

  return (
    <CustomAppearanceContext.Provider key={colorScheme} value={{ toggleTheme }}>
      {children}
    </CustomAppearanceContext.Provider>
  );
}

async function cacheAppearanceState(isDark: boolean) {
  await AsyncStorage.setItem(appearanceStorageKey, JSON.stringify({ isDark }));
}

async function rehydrateAppearanceState() {
  if (!shouldRehydrate || !AsyncStorage) {
    return defaultState;
  }

  try {
    const item = await AsyncStorage.getItem(appearanceStorageKey);
    return item ? JSON.parse(item) : defaultState;
  } catch {
    return defaultState;
  }
}
