import React from 'react';
import { useTheme } from './ThemeContext';
import CustomSelect from './CustomSelect';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  const handleThemeChange = (newValue) => {
    toggleTheme(newValue);
  };  

  const themeOptions = [
    { value: 'original-theme', label: 'Original Theme', disabled: false },
    { value: 'jungle-theme', label: 'Jungle Theme', disabled: false },
    { value: 'industrial-theme', label: 'Industrial Theme', disabled: false },
  ];

  return (
    <CustomSelect
      value={theme}
      onChange={handleThemeChange}
      options={themeOptions}
    />
  );
};

export default ThemeSwitcher;