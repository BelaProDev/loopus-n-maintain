import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Failed to find the root element");
}

// Create QueryClient with proper hydration handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: false,
      // Only use initial data if it's available
      ...(window.__INITIAL_STATE__ && {
        initialData: window.__INITIAL_STATE__
      })
    },
  },
});

// Render app after ensuring service worker is ready
const renderApp = () => {
  const root = createRoot(container);
  
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

// Initialize app and service worker
const init = async () => {
  try {
    // Register service worker in production
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      await navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.error('SW registration failed:', error);
        });
    }

    // Wait for service worker to be ready before rendering
    if (navigator.serviceWorker?.controller) {
      await navigator.serviceWorker.ready;
    }

    renderApp();
  } catch (error) {
    console.error('Initialization failed:', error);
    // Render app even if service worker fails
    renderApp();
  }
};

init();

// Add TypeScript declaration
declare global {
  interface Window {
    __INITIAL_STATE__: any;
  }
}