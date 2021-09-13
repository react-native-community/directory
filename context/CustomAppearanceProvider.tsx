import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { StatusBar, View } from 'react-native';
import { useColorScheme } from 'react-native-appearance';

import CustomAppearanceContext from './CustomAppearanceContext';

const appearanceStorageKey = '@ReactNativeDirectory:CustomAppearanceContext';
const shouldRehydrate = true;

const defaultState = { isDark: false };

const CustomAppearanceProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = React.useState(colorScheme === 'dark');
  const [isLoaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const rehydrateAsync = async () => {
      try {
        const { isDark } = await rehydrateAppearanceState();
        setIsDark(isDark);
      } catch (ignored) {}
      setLoaded(true);
    };

    rehydrateAsync();
  }, []);

  React.useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
  }, [isDark]);

  if (!isLoaded) {
    return <View />;
  } else {
    return (
      <CustomAppearanceContext.Provider
        value={{
          isDark,
          setIsDark: isDark => {
            setIsDark(isDark);
            cacheAppearanceState({ isDark });
          },
        }}>
        {children}
      </CustomAppearanceContext.Provider>
    );
  }
};

async function cacheAppearanceState(appearance) {
  await AsyncStorage.setItem(appearanceStorageKey, JSON.stringify(appearance));
}

async function rehydrateAppearanceState() {
  if (!shouldRehydrate || !AsyncStorage) {
    return defaultState;
  }

  try {
    const item = await AsyncStorage.getItem(appearanceStorageKey);
    return JSON.parse(item);
  } catch (ignored) {
    return defaultState;
  }
}

export default CustomAppearanceProvider;
