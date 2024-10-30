import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider, dehydrate } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import { closeMongoConnection } from './lib/mongodb/client';

export async function render(url: string, context: any) {
  const queryClient = new QueryClient();

  // Pre-fetch any necessary data here
  // await queryClient.prefetchQuery(['key'], fetchFunction);

  const html = ReactDOMServer.renderToString(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </AuthProvider>
    </QueryClientProvider>
  );

  // Clean up MongoDB connection after rendering
  await closeMongoConnection();

  return {
    html,
    context,
    state: dehydrate(queryClient)
  };
}