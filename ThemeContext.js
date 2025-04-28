
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loadouts } from '../styles/themes';

const ThemeContext = createContext();

/**
 * ThemeProvider
 * - on mount: loads stored theme from AsyncStorage
 * - exposes `theme`, `themeName`, and `setTheme(name)` to change & persist theme
 */
export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('OpsCoreNightfall');

  const setTheme = async (name) => {
    try {
      await AsyncStorage.setItem('themeName', name);
      setThemeName(name);
    } catch (e) {
      console.warn('Failed to save theme:', e);
    }
  };

  // Load persisted theme once
  useEffect(() => {
    async function loadTheme() {
      try {
        const stored = await AsyncStorage.getItem('themeName');
        if (stored && Loadouts[stored]) {
          setThemeName(stored);
        }
      } catch (e) {
        console.warn('Failed to load theme:', e);
      }
    }
    loadTheme();
  }, []);

  // changeTheme persists name + updates state
    if (!Loadouts[name]) {
      console.warn(`Theme "${name}" not found, ignoring.`);
      return;
    }
    try {
      await AsyncStorage.setItem('themeName', name);
      setThemeName(name);
    } catch (e) {
      console.warn('Failed to save theme:', e);
    }
  };

  const theme = Loadouts[themeName] || Loadouts.OpsCoreNightfall;

  const setTheme = async (name) => {
    if (!Loadouts[name]) return;
    try {
      await AsyncStorage.setItem("themeName", name);
      _setThemeName(name);
    } catch (e) {
      console.warn("Failed to persist theme:", e);
    }
  };

  return (
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};
