import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <Toaster />
      </div>
    </AuthProvider>
  );
};

export default App;
