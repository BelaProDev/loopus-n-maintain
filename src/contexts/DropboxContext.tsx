import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dropbox } from 'dropbox';
import { toast } from 'sonner';
import { 
  getStoredTokens, 
  storeTokens, 
  clearTokens, 
  isTokenExpired,
  createDropboxClient 
} from '@/lib/auth/dropboxAuthUtils';

interface DropboxContextType {
  isAuthenticated: boolean;
  client: Dropbox | null;
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
    const tokens = getStoredTokens();
    return tokens?.access_token ? createDropboxClient(tokens.access_token) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getStoredTokens());
  const [showAuthSelector, setShowAuthSelector] = useState(false);

  useEffect(() => {
    const checkTokenExpiry = () => {
      if (isTokenExpired()) {
        disconnect();
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, []);

  const connect = async (method?: 'callback' | 'offline') => {
    if (!method) {
      setShowAuthSelector(true);
      return;
    }

    setShowAuthSelector(false);
    const DROPBOX_APP_KEY = import.meta.env.VITE_DROPBOX_APP_KEY;
    const REDIRECT_URI = `${window.location.origin}/dropbox-explorer/callback`;

    try {
      if (method === 'callback') {
        const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${DROPBOX_APP_KEY}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
        window.location.href = authUrl;
      } else {
        const response = await fetch('/.netlify/functions/dropbox-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'initiate' }),
        });
        
        const { authUrl, state } = await response.json();
        if (!authUrl) throw new Error('Failed to get authentication URL');
        
        localStorage.setItem('dropbox_state', state);
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error('Dropbox connection error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to connect to Dropbox');
    }
  };

  const disconnect = () => {
    clearTokens();
    setClient(null);
    setIsAuthenticated(false);
    toast.success('Disconnected from Dropbox');
  };

  return (
    <DropboxContext.Provider value={{ 
      isAuthenticated, 
      client,
      connect, 
      disconnect,
      showAuthSelector,
      setShowAuthSelector,
    }}>
      {children}
    </DropboxContext.Provider>
  );
};