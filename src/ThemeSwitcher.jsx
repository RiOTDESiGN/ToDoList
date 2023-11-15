import React from 'react';
import { useTheme } from './ThemeContext';
import CustomSelect from './CustomSelect';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  const handleThemeChange = (newValue) => {
    toggleTheme(newValue);
  };  

  const themeOptions = [
    { value: 'default-theme', label: 'Traffic Lights Theme', disabled: false },
    { value: 'jungle-theme', label: 'Jungle Theme', disabled: false },
    { value: 'industrial-theme', label: 'Industrial Theme', disabled: false },
  ];

  const isValidTheme = themeOptions.some(option => option.value === theme);
  const themeName = isValidTheme ? theme : 'default-theme';

  return (
    <CustomSelect
      className='themeswitcher'
      value={themeName}
      onChange={handleThemeChange}
      options={themeOptions}
    />
  );
};

export default ThemeSwitcher;