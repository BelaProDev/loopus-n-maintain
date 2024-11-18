import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import i18n from './i18n';  // Import i18n configuration first
import './index.css';
import { initVitals } from './lib/monitoring/analytics';
import ErrorBoundary from './lib/monitoring/ErrorBoundary';

// Wait for translations to be loaded before rendering
i18n.loadNamespaces(['common', 'services', 'admin', 'auth', 'docs', 'ui', 'app', 'settings', 'tools']).then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading translations...</div>}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Suspense>
      </ErrorBoundary>
    </React.StrictMode>
  );
});

initVitals();