import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './ThemeContext';

const savedTheme = localStorage.getItem('appTheme') || 'original';
document.documentElement.className = savedTheme;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider initialTheme={savedTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);