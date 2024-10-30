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

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'koalax/*',
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
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>
)