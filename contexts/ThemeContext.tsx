// contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { lightTheme, darkTheme, Theme } from "../styles/themes";

interface ThemeContextType {
  theme: Theme;
  mode: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  mode: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = Appearance.getColorScheme();
  const [mode, setMode] = useState<"light" | "dark">(colorScheme || "light");
  const [hasStoredPreference, setHasStoredPreference] = useState(false);

  const STORAGE_KEY = 'iven_theme_mode';

  useEffect(() => {
    // Charger la préférence stockée si présente
    const loadStoredTheme = async () => {
      try {
        const stored = await SecureStore.getItemAsync(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
          setMode(stored);
          setHasStoredPreference(true);
        }
      } catch (e) {
        // Ignorer en silence
      }
    };
    loadStoredTheme();
  }, []);

  useEffect(() => {
    // Suivre les changements système seulement si aucune préférence utilisateur
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (!hasStoredPreference) {
        setMode(colorScheme || "light");
      }
    });
    return () => listener.remove();
  }, [hasStoredPreference]);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      // Sauvegarder la préférence utilisateur
      SecureStore.setItemAsync(STORAGE_KEY, next).catch(() => {});
      setHasStoredPreference(true);
      return next;
    });
  };

  const currentTheme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
