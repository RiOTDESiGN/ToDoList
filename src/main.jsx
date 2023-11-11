import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './ThemeContext';
import './themes.css'
import './index.css'
import "./assets/Antro_Vectra_Bolder.otf";
import "./assets/JMH_Typewriter.otf";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
