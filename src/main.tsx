import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import i18n from './i18n';
import './index.css';
import { initVitals } from './lib/monitoring/analytics';
import ErrorBoundary from './lib/monitoring/ErrorBoundary';

const loadTranslations = async () => {
  try {
    await i18n.loadNamespaces(['common', 'services', 'admin', 'auth', 'docs', 'ui', 'app', 'settings', 'tools']);
    
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
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
};

loadTranslations();
initVitals();