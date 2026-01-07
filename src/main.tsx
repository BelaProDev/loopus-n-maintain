import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import App from './App';
import './index.css';
import './i18n';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Tools from './pages/Tools';
import Documentation from './pages/Documentation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Index /> },
      { path: 'login', element: <Login /> },
      { path: 'contact', element: <Contact /> },
      { path: 'services', element: <Services /> },
      { path: 'services/:serviceId', element: <Services /> },
      { path: 'tools', element: <Tools /> },
      { path: 'tools/:toolId', element: <Tools /> },
      { path: 'docs', element: <Documentation /> },
      { path: 'admin', element: <Login /> },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
