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
  const [client, setClient] = useState<Dropbox | null>(() => {
    const token = window.localStorage.getItem('dropboxToken');
    return token ? new Dropbox({ accessToken: token }) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!window.localStorage.getItem('dropboxToken');
  });
  const [showAuthSelector, setShowAuthSelector] = useState(false);

  const connectWithCallback = async () => {
    try {
      const dbx = new Dropbox({
        clientId: import.meta.env.VITE_DROPBOX_APP_KEY,
      });

      const authUrl = await dbx.getAuthenticationUrl(
        `${window.location.origin}/dropbox-explorer/callback`,
        undefined,
        'token',
        'legacy',
        undefined,
        undefined,
        true
      );

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

    } catch (error) {
      console.error('Dropbox connection error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to connect to Dropbox');
    }
  };

  const connectWithOfflineAccess = async () => {
    try {
      const response = await fetch('/.netlify/functions/dropbox-auth');
      const { authUrl, state } = await response.json();
      
      if (!authUrl) {
        throw new Error('Failed to get authentication URL');
      }

      // Store state for verification
      window.localStorage.setItem('dropboxAuthState', state);
      
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

      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data?.type === 'DROPBOX_AUTH_CODE') {
          const { code, state: returnedState } = event.data;
          
          const savedState = window.localStorage.getItem('dropboxAuthState');
          if (returnedState !== savedState) {
            throw new Error('Invalid state parameter');
          }

          const tokenResponse = await fetch('/.netlify/functions/dropbox-auth', {
            method: 'POST',
            body: JSON.stringify({ code }),
          });
          
          const tokens = await tokenResponse.json();
          
          if (tokens.error) {
            throw new Error(tokens.error);
          }

          const newClient = new Dropbox({ accessToken: tokens.access_token });
          setClient(newClient);
          setIsAuthenticated(true);
          window.localStorage.setItem('dropboxToken', tokens.access_token);
          window.localStorage.setItem('dropboxRefreshToken', tokens.refresh_token);
          
          toast.success('Successfully connected to Dropbox');
          window.removeEventListener('message', handleMessage);
          popup.close();
        }
      };

      window.addEventListener('message', handleMessage);

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
    window.localStorage.removeItem('dropboxRefreshToken');
    window.localStorage.removeItem('dropboxAuthState');
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