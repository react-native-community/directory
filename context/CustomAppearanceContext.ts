import { createContext } from 'react';

export type CustomAppearanceContextType = {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
};

export default createContext<CustomAppearanceContextType>({ isDark: false, setIsDark() {} });
