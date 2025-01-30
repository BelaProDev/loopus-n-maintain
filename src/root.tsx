import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Provider } from 'react-redux';
import { store } from './store';
import { DropboxProvider } from '@/contexts/DropboxContext';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppErrorBoundary } from './lib/monitoring/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppErrorBoundary>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <DropboxProvider>
                  <Outlet />
                </DropboxProvider>
              </AuthProvider>
            </QueryClientProvider>
          </Provider>
        </AppErrorBoundary>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <h1 className="mb-4 text-2xl font-bold">Something went wrong!</h1>
          <p className="text-red-500">An unexpected error occurred.</p>
        </div>
        <Scripts />
      </body>
    </html>
  );
}