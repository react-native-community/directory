import AsyncStorage from '@react-native-async-storage/async-storage';
import { type PropsWithChildren, useEffect, useState } from 'react';

import tw, { useDeviceContext, useAppColorScheme } from '~/util/tailwind';

import CustomAppearanceContext, {
  type CustomAppearanceContextType,
} from './CustomAppearanceContext';

const appearanceStorageKey = '@ReactNativeDirectory:CustomAppearanceContext';
const shouldRehydrate = true;

const defaultState = { isDark: false };

export default function CustomAppearanceProvider({ children }: PropsWithChildren) {
  const [colorScheme, , setColorScheme] = useAppColorScheme(tw);
  const [isDark, setIsDark] = useState(colorScheme === 'dark');

  function toggleTheme(isDark: boolean) {
    const el = document.documentElement;

    if (isDark) {
      el.classList.add('dark');
    } else {
      el.classList.remove('dark');
    }

    setColorScheme(isDark ? 'dark' : 'light');
    setIsDark(isDark);
  }

  useDeviceContext(tw, {
    observeDeviceColorSchemeChanges: false,
    initialColorScheme: colorScheme === 'dark' ? 'dark' : 'light',
  });

  useEffect(() => {
    async function rehydrateAsync() {
      try {
        const { isDark } = await rehydrateAppearanceState();
        toggleTheme(isDark);
      } catch {}
    }

    void rehydrateAsync();
  }, []);

  return (
    <CustomAppearanceContext.Provider
      key={tw.memoBuster}
      value={{
        isDark,
        setIsDark: isDark => {
          toggleTheme(isDark);
          void cacheAppearanceState({ isDark });
        },
      }}>
      {children}
    </CustomAppearanceContext.Provider>
  );
}

async function cacheAppearanceState(appearance: Omit<CustomAppearanceContextType, 'setIsDark'>) {
  await AsyncStorage.setItem(appearanceStorageKey, JSON.stringify(appearance));
}

async function rehydrateAppearanceState() {
  if (!shouldRehydrate || !AsyncStorage) {
    return defaultState;
  }

  try {
    const item = await AsyncStorage.getItem(appearanceStorageKey);
    return item ? JSON.parse(item) : null;
  } catch {
    return defaultState;
  }
}
