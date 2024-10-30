import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import { fallbackDB } from './lib/fallback-db';

interface RenderResult {
  html: string;
  context: Record<string, any>;
  state: string;
  error?: Error;
}

export async function render(url: string): Promise<RenderResult> {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
      },
    },
  });

  try {
    // Prefetch critical data
    await queryClient.prefetchQuery({
      queryKey: ['content'],
      queryFn: () => fallbackDB.find('content')
    });

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

    // Dehydrate query cache - fixed TypeScript error by using proper type
    const state = JSON.stringify({
      queries: queryClient.getQueryCache().getAll().map(query => ({
        queryKey: query.queryKey,
        data: query.state.data
      }))
    });

    return {
      html,
      context: {},
      state
    };
  } catch (error) {
    console.error('Server-side rendering failed:', error);
    return {
      html: '',
      context: {},
      state: '{}',
      error: error as Error
    };
  }
}