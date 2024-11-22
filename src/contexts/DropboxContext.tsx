import React, { createContext, useContext, useState } from 'react';
import { Dropbox } from 'dropbox';
import { useDropboxAuth } from '@/hooks/useDropboxAuth';
import { createDropboxClient } from '@/lib/auth/dropboxAuthUtils';

interface DropboxContextType {
  isAuthenticated: boolean;
  client: Dropbox | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
}

const DropboxContext = createContext<DropboxContextType | null>(null);

export const useDropbox = () => {
  const context = useContext(DropboxContext);
  if (!context) {
    throw new Error('useDropbox must be used within a DropboxProvider');
  }
  return context;
};

export const DropboxProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<Dropbox | null>(null);
  const { isAuthenticated, isLoading, initiateAuth, logout } = useDropboxAuth();

  const connect = async () => {
    await initiateAuth();
  };

  const disconnect = () => {
    setClient(null);
    logout();
  };

  return (
    <DropboxContext.Provider value={{ 
      isAuthenticated, 
      client,
      connect,
      disconnect,
      isLoading
    }}>
      {children}
    </DropboxContext.Provider>
  );
};