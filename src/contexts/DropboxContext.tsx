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

      const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${import.meta.env.VITE_DROPBOX_APP_KEY}&response_type=token&redirect_uri=${encodeURIComponent(`${window.location.origin}/dropbox-explorer/callback`)}`;

      // Open popup window
      const width = 800;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        authUrl,
        'Dropbox Auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Listen for the callback
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data?.type === 'DROPBOX_AUTH_SUCCESS') {
          const { accessToken } = event.data;
          
          // Set up client with the received token
          const newClient = new Dropbox({ accessToken });
          setClient(newClient);
          setIsAuthenticated(true);
          
          window.localStorage.setItem('dropboxToken', accessToken);
          toast.success('Successfully connected to Dropbox');
          
          // Clean up
          window.removeEventListener('message', handleMessage);
          popup.close();
        }
      };

      window.addEventListener('message', handleMessage);
      window.localStorage.setItem('dropboxAuthPending', 'true');

    } catch (error) {
      console.error('Dropbox connection error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to connect to Dropbox');
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