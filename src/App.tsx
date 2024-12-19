import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DropboxProvider } from '@/contexts/DropboxContext';
import { DropboxCallback } from './pages/DropboxExplorer/components/DropboxCallback';
import DropboxExplorer from './pages/DropboxExplorer';
import ErrorBoundary from './lib/monitoring/ErrorBoundary';
import Index from './pages/Index';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <DropboxProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dropbox" element={<DropboxExplorer />} />
                <Route path="/dropbox-callback" element={<DropboxCallback />} />
              </Routes>
            </DropboxProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;