import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Failed to find the root element");
}

// Get the dehydrated state from the server
const dehydratedState = window.__REACT_QUERY_STATE__;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    },
  },
});

// Determine if we're hydrating from SSR
const shouldHydrate = container.hasChildNodes();

const app = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  </StrictMode>
);

// Register service worker for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.error('SW registration failed:', error);
      });
  });
}

// Use hydrateRoot for SSR, createRoot for CSR
if (shouldHydrate) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}

// Add TypeScript declaration for the window object
declare global {
  interface Window {
    __REACT_QUERY_STATE__?: any;
  }
}