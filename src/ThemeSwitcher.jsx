import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import CustomSelect from './CustomSelect';

const ThemeSwitcher = () => {
  const { toggleTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState('original-theme');

  const handleThemeChange = (newValue) => {
    setSelectedTheme(newValue);
    toggleTheme(newValue);
  };

  const themeOptions = [
    { value: 'original-theme', label: 'Original Theme', disabled: false },
    { value: 'jungle-theme', label: 'Jungle Theme', disabled: false },
    { value: 'industrial-theme', label: 'Industrial Theme', disabled: false },
    // add more themes here
  ];

  return (
    <CustomSelect
      value={selectedTheme}
      onChange={handleThemeChange}
      options={themeOptions}
    />
  );
};

export default ThemeSwitcher;