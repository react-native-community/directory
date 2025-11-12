import AsyncStorage from '@react-native-async-storage/async-storage';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { Appearance, View } from 'react-native';

import CustomAppearanceContext, {
  type CustomAppearanceContextType,
} from './CustomAppearanceContext';

const appearanceStorageKey = '@ReactNativeDirectory:CustomAppearanceContext';
const shouldRehydrate = true;

const defaultState = { isDark: false };

function CustomAppearanceProvider({ children }: PropsWithChildren) {
  const colorScheme = Appearance.getColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    async function rehydrateAsync() {
      try {
        const { isDark } = await rehydrateAppearanceState();
        setIsDark(isDark);
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
        value={{
          isDark,
          setIsDark: isDark => {
            setIsDark(isDark);
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

export default CustomAppearanceProvider;
