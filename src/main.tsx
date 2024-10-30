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

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: false,
      refetchOnWindowFocus: false
    }
  }
})

// Create router configuration
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

// Initialize router with routes configuration
const router = createBrowserRouter(routes);

// Mount application after styles are loaded
const mount = () => {
  const root = document.getElementById('root');
  if (!root) throw new Error('Root element not found');
  
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

// Ensure styles and DOM are loaded before mounting
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}