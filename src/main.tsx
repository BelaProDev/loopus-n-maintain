import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import './index.css'
import Login from './pages/Login'
import Koalax from './pages/Koalax'
import Architecture from './pages/Architecture'
import Documentation from './pages/Documentation'
import Electrics from './pages/Electrics'
import Ironwork from './pages/Ironwork'
import Plumbing from './pages/Plumbing'
import Woodwork from './pages/Woodwork'
import ServiceLayout from './pages/ServiceLayout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import Index from './pages/Index'

// Create QueryClient instance with explicit configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: false,
      refetchOnWindowFocus: false,
      // Ensure query results are properly initialized
      initialData: undefined
    }
  }
})

// Define routes with explicit paths and elements
const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'koalax',
        element: <Koalax />
      },
      {
        path: 'services',
        element: <ServiceLayout />,
        children: [
          {
            path: 'architecture',
            element: <Architecture />
          },
          {
            path: 'documentation',
            element: <Documentation />
          },
          {
            path: 'electrics',
            element: <Electrics />
          },
          {
            path: 'ironwork',
            element: <Ironwork />
          },
          {
            path: 'plumbing',
            element: <Plumbing />
          },
          {
            path: 'woodwork',
            element: <Woodwork />
          }
        ]
      }
    ]
  }
];

// Initialize router with explicit error boundary
const router = createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true,
  }
});

// Mount function with proper error handling
const mount = () => {
  const root = document.getElementById('root');
  if (!root) throw new Error('Root element not found');
  
  const rootInstance = ReactDOM.createRoot(root);
  
  rootInstance.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

// Ensure DOM and styles are fully loaded before mounting
const initializeApp = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Small delay to ensure styles are loaded
      setTimeout(mount, 0);
    });
  } else {
    mount();
  }
};

initializeApp();