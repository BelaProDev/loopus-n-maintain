import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { DropboxProvider } from './contexts/DropboxContext';

const App = () => {
  return (
    <AuthProvider>
      <DropboxProvider>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
        </div>
      </DropboxProvider>
    </AuthProvider>
  );
};

export default App;
