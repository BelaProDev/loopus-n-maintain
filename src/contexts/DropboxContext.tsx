import React, { createContext, useContext, useState } from 'react';
import { Dropbox } from 'dropbox';
import { toast } from 'sonner';

interface DropboxContextType {
  client: Dropbox | null;
  isAuthenticated: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const connect = async () => {
    try {
      const dbx = new Dropbox({
        clientId: import.meta.env.VITE_DROPBOX_APP_KEY,
      });

      const authUrl = dbx.auth.getAuthenticationUrl(
        `${window.location.origin}/dropbox-explorer/callback`
      );

      window.localStorage.setItem('dropboxAuthPending', 'true');
      window.location.href = authUrl;
    } catch (error) {
      console.error('Dropbox connection error:', error);
      toast.error('Failed to connect to Dropbox');
    }
  };

  const disconnect = () => {
    setClient(null);
    setIsAuthenticated(false);
    window.localStorage.removeItem('dropboxToken');
    toast.success('Disconnected from Dropbox');
  };

  return (
    <DropboxContext.Provider value={{ client, isAuthenticated, connect, disconnect }}>
      {children}
    </DropboxContext.Provider>
  );
};