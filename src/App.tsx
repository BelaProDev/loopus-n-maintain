import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DropboxProvider } from '@/contexts/DropboxContext';
import { DropboxCallback } from './pages/DropboxExplorer/components/DropboxCallback';
import DropboxExplorer from './pages/DropboxExplorer';
import ErrorBoundary from './lib/monitoring/ErrorBoundary';
import Index from './pages/Index';

const App = () => {
  return (
    <ErrorBoundary>
      <DropboxProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dropbox" element={<DropboxExplorer />} />
            <Route path="/dropbox-callback" element={<DropboxCallback />} />
          </Routes>
        </Router>
      </DropboxProvider>
    </ErrorBoundary>
  );
};

export default App;