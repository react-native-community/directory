import AsyncStorage from '@react-native-async-storage/async-storage';
import { type PropsWithChildren, useEffect } from 'react';

import tw, { useDeviceContext, useAppColorScheme } from '~/util/tailwind';

import CustomAppearanceContext from './CustomAppearanceContext';

const appearanceStorageKey = '@ReactNativeDirectory:CustomAppearanceContext';
const shouldRehydrate = true;
const defaultState = { isDark: false };

export default function CustomAppearanceProvider({ children }: PropsWithChildren) {
  const [colorScheme, , setColorScheme] = useAppColorScheme(tw);

  function toggleTheme() {
    if (colorScheme === 'dark') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  }

  useDeviceContext(tw, {
    observeDeviceColorSchemeChanges: false,
    initialColorScheme: colorScheme === 'dark' ? 'dark' : 'light',
  });

  useEffect(() => {
    async function rehydrateAsync() {
      try {
        const { isDark } = await rehydrateAppearanceState();
        isDark && toggleTheme();
      } catch {}
    }

    void rehydrateAsync();
  }, []);

  return (
    <CustomAppearanceContext.Provider
      key={colorScheme}
      value={{
        toggleTheme: () => {
          toggleTheme();
          void cacheAppearanceState(colorScheme !== 'dark');
        },
      }}>
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
