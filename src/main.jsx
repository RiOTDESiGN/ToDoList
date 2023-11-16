import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './ThemeContext';
import AppRoutes from './AppRoutes.jsx';

const savedTheme = localStorage.getItem('appTheme') || 'default';
document.documentElement.className = savedTheme;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider initialTheme={savedTheme}>
      <AppRoutes />
    </ThemeProvider>
  </React.StrictMode>
);