import React, { createContext, useContext } from 'react';
import { Dropbox } from 'dropbox';
import { useDropboxAuth } from '@/hooks/useDropboxAuth';

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
  const { isAuthenticated, isLoading, login, logout } = useDropboxAuth();
  const [client, setClient] = React.useState<Dropbox | null>(null);

  const connect = async () => {
    await login();
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