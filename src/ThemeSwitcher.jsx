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
    { value: 'ocean-theme', label: 'Ocean Theme', disabled: false },
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