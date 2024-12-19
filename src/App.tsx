import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DropboxProvider } from '@/contexts/DropboxContext';
import { DropboxCallback } from './pages/DropboxExplorer/components/DropboxCallback';
import DropboxExplorer from './pages/DropboxExplorer';
import ErrorBoundary from './lib/monitoring/ErrorBoundary';
import Index from './pages/Index';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';

const App = () => {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default App;