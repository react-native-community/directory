import { createContext } from 'react';

export type CustomAppearanceContextType = {
  toggleTheme: () => void;
};

export default createContext<CustomAppearanceContextType>({
  toggleTheme() {},
});
