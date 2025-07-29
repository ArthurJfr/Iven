// contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";

const themes = {
  light: {
    background: "#fff",
    text: "#222",
    buttonText: "#fff",
    primary: "#2563eb",
    secondary: "#222",
    tertiary: "#333",
    switch: "#222", 
  },
  dark: {
    background: "#18181b",
    text: "#fff",
    buttonText: "#fff",
    primary: "#2563eb",
    secondary: "#222",
    tertiary: "#333",
    switch: "#222", 
  },
};

const ThemeContext = createContext({
  theme: themes.light,
  mode: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = Appearance.getColorScheme();
  const [mode, setMode] = useState<"light" | "dark">(colorScheme || "light");

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setMode(colorScheme || "light");
    });
    return () => listener.remove();
  }, []);

  const toggleTheme = () => setMode((prev) => {
    console.log("switch theme", prev);
    return prev === "light" ? "dark" : "light";
  });

  return (
    <ThemeContext.Provider value={{ theme: themes[mode], mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
