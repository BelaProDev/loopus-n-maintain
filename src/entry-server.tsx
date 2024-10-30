import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import { fallbackDB } from './lib/fallback-db';

export async function render(url: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false,
      },
    },
  });

  // Prefetch initial data
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['content'],
      queryFn: () => fallbackDB.find('content')
    }),
    // Add other critical data prefetching here
  ]);

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

  const dehydratedState = JSON.stringify(queryClient.getQueryData(['content']));

  return {
    html,
    context: {},
    state: dehydratedState
  };
}