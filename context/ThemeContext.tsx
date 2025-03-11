import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark';

interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  secondaryText: string;
  accent: string;
}

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  primary: '#8e44ad', // Purple
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#000000',
  border: '#e1e1e1',
  notification: '#9b59b6', // Light purple
  secondaryText: '#666666',
  accent: '#a55eea', // Another purple shade
};

const darkColors: ThemeColors = {
  primary: '#9b59b6', // Purple for dark mode
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  border: '#333333',
  notification: '#8e44ad', // Darker purple
  secondaryText: '#aaaaaa',
  accent: '#a55eea', // Same accent
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: lightColors,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const [colors, setColors] = useState<ThemeColors>(lightColors);

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setTheme(savedTheme);
          setColors(savedTheme === 'light' ? lightColors : darkColors);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    
    loadTheme();
  }, []);

  // Save theme to storage whenever it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('theme', theme);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    };
    
    saveTheme();
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      setColors(newTheme === 'light' ? lightColors : darkColors);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};