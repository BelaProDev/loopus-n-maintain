import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initSentry } from './lib/monitoring/sentry';
import { initVitals } from './lib/monitoring/analytics';
import ErrorBoundary from './lib/monitoring/ErrorBoundary';

// Initialize monitoring
initSentry();
initVitals();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);