import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');

const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register Service Worker with improved error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, notify user if needed
                console.log('New content is available; please refresh.');
              }
            });
          }
        });
      })
      .catch(err => {
        console.error('ServiceWorker registration failed: ', err);
      });
  });

  // Handle offline/online status
  window.addEventListener('online', () => {
    console.log('Application is online');
  });
  
  window.addEventListener('offline', () => {
    console.log('Application is offline');
  });
}