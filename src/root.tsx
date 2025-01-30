import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { AppErrorBoundary } from './lib/monitoring/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { DropboxProvider } from '@/contexts/DropboxContext';

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
          <AuthProvider>
            <DropboxProvider>
              <Outlet />
            </DropboxProvider>
          </AuthProvider>
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