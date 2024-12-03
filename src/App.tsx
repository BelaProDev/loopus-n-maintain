import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DropboxProvider } from '@/contexts/DropboxContext';
import { DropboxCallback } from './pages/DropboxExplorer/components/DropboxCallback';
import DropboxExplorer from './pages/DropboxExplorer';

const App = () => {
  return (
    <DropboxProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DropboxExplorer />} />
          <Route path="/dropbox-callback" element={<DropboxCallback />} />
        </Routes>
      </Router>
    </DropboxProvider>
  );
};

export default App;
