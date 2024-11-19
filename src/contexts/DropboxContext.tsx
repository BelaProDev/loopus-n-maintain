import React, { createContext, useContext, useState } from 'react';
import { Dropbox } from 'dropbox';
import { toast } from 'sonner';
import AuthMethodSelector from '@/components/business/dropbox/AuthMethodSelector';

interface DropboxContextType {
  client: Dropbox | null;
  isAuthenticated: boolean;
  connect: (method?: 'callback' | 'offline') => Promise<void>;
  disconnect: () => void;
  showAuthSelector: boolean;
  setShowAuthSelector: (show: boolean) => void;
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
  const [showAuthSelector, setShowAuthSelector] = useState(false);

  const connectWithCallback = async () => {
    try {
      const dbx = new Dropbox({
        clientId: import.meta.env.VITE_DROPBOX_APP_KEY,
      });

      const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${import.meta.env.VITE_DROPBOX_APP_KEY}&response_type=token&redirect_uri=${encodeURIComponent(`${window.location.origin}/dropbox-explorer/callback`)}`;

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

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data?.type === 'DROPBOX_AUTH_SUCCESS') {
          const { accessToken } = event.data;
          const newClient = new Dropbox({ accessToken });
          setClient(newClient);
          setIsAuthenticated(true);
          window.localStorage.setItem('dropboxToken', accessToken);
          toast.success('Successfully connected to Dropbox');
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

  const connectWithOfflineAccess = async () => {
    try {
      const response = await fetch('/.netlify/functions/dropbox-auth');
      const { authUrl } = await response.json();
      
      if (!authUrl) {
        throw new Error('Failed to get authentication URL');
      }

      window.location.href = authUrl;
    } catch (error) {
      console.error('Dropbox offline auth error:', error);
      toast.error('Failed to initiate offline authentication');
    }
  };

  const connect = async (method?: 'callback' | 'offline') => {
    if (!method) {
      setShowAuthSelector(true);
      return;
    }

    setShowAuthSelector(false);
    if (method === 'callback') {
      await connectWithCallback();
    } else {
      await connectWithOfflineAccess();
    }
  };

  const disconnect = () => {
    setClient(null);
    setIsAuthenticated(false);
    window.localStorage.removeItem('dropboxToken');
    toast.success('Disconnected from Dropbox');
  };

  return (
    <DropboxContext.Provider value={{ 
      client, 
      isAuthenticated, 
      connect, 
      disconnect,
      showAuthSelector,
      setShowAuthSelector
    }}>
      {children}
    </DropboxContext.Provider>
  );
};