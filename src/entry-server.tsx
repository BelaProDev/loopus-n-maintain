import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider, dehydrate } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';

export async function render(url: string, context: Record<string, unknown>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },
    },
  });

  // Pre-fetch critical data here
  // await queryClient.prefetchQuery(['key'], fetchFunction);

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );

  // Get the dehydrated state
  const dehydratedState = dehydrate(queryClient);

  return {
    html,
    context,
    state: dehydratedState
  };
}