import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ColorTheme } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

// Theme context type definitions
export interface Theme {
  colors: ColorTheme;
  typography: typeof typography;
  spacing: typeof spacing;
  isDark: boolean;
}

// Create theme context
const ThemeContext = createContext<Theme | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
  children: React.ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  
  // Theme state (can be overridden by user preference in the future)
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  
  // Update theme when system scheme changes
  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);
  
  // Create theme object
  const theme: Theme = {
    colors: isDark ? darkColors : lightColors,
    typography,
    spacing,
    isDark,
  };
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);
  
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return theme;
};
