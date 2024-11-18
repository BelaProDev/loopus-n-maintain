import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './i18n';  // Import i18n configuration first
import './index.css';
import { initVitals } from './lib/monitoring/analytics';
import ErrorBoundary from './lib/monitoring/ErrorBoundary';

// Wait for translations to be loaded before rendering
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
});

initVitals();