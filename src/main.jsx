import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Login from './Login.jsx';
import { ThemeProvider } from './ThemeContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const savedTheme = localStorage.getItem('appTheme') || 'default';
document.documentElement.className = savedTheme;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider initialTheme={savedTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);