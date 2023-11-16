import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children, initialTheme }) => {
  const [theme, setTheme] = useState(initialTheme);

  const toggleTheme = (themeName) => {
    setTheme(themeName);
    document.documentElement.className = themeName;
    localStorage.setItem('appTheme', themeName);
  };

  const resetTheme = () => {
    const defaultTheme = 'default-theme';
    setTheme(defaultTheme);
    document.documentElement.className = defaultTheme;
    localStorage.setItem('appTheme', defaultTheme);
    console.log("Theme has been reset.");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};