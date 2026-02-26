import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/auth-context';
import { ToastProvider } from './context/toast-context';
import App from './App';
import { getThemeColors } from './constants/theme';

// Apply theme from theme.ts configuration
const themeColors = getThemeColors();
document.documentElement.style.setProperty('--color-primary', themeColors.primary);
document.documentElement.style.setProperty('--color-primary-hover', themeColors.primaryHover);
document.documentElement.style.setProperty('--color-primary-light', themeColors.primaryLight);

// apply saved theme class (legacy support)
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.className = savedTheme;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
