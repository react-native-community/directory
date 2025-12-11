import AsyncStorage from '@react-native-async-storage/async-storage';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { View } from 'react-native';
import tw, { useDeviceContext, useAppColorScheme } from 'twrnc';

import CustomAppearanceContext, {
  type CustomAppearanceContextType,
} from './CustomAppearanceContext';

const appearanceStorageKey = '@ReactNativeDirectory:CustomAppearanceContext';
const shouldRehydrate = true;

const defaultState = { isDark: false };

export default function CustomAppearanceProvider({ children }: PropsWithChildren) {
  const [colorScheme, , setColorScheme] = useAppColorScheme(tw);
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
  const [isLoaded, setLoaded] = useState(false);

  useDeviceContext(tw, {
    observeDeviceColorSchemeChanges: false,
    initialColorScheme: colorScheme === 'dark' ? 'dark' : 'light',
  });

  useEffect(() => {
    async function rehydrateAsync() {
      try {
        const { isDark } = await rehydrateAppearanceState();
        setIsDark(isDark);
        setColorScheme(isDark ? 'dark' : 'light');
      } catch {}
      setLoaded(true);
    }

    void rehydrateAsync();
  }, []);

  if (!isLoaded) {
    return <View />;
  } else {
    return (
      <CustomAppearanceContext.Provider
        key={tw.memoBuster}
        value={{
          isDark,
          setIsDark: isDark => {
            setIsDark(isDark);
            setColorScheme(isDark ? 'dark' : 'light');
            void cacheAppearanceState({ isDark });
          },
        }}>
        {children}
      </CustomAppearanceContext.Provider>
    );
  }
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
