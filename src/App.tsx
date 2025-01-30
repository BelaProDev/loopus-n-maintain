import React from 'react';
import { DropboxProvider } from '@/contexts/DropboxContext';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DropboxProvider>
          <div className="min-h-screen bg-background">
            {/* Outlet will be rendered by Remix */}
          </div>
        </DropboxProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
