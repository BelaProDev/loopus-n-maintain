import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { dropboxAuth } from '@/lib/api/dropboxAuth';
import AuthMethodSelector from '@/components/business/dropbox/AuthMethodSelector';

interface DropboxContextType {
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => dropboxAuth.isAuthenticated());
  const [showAuthSelector, setShowAuthSelector] = useState(false);

  useEffect(() => {
    const checkTokenExpiry = () => {
      const expiryTime = localStorage.getItem('dropboxTokenExpiry');
      if (expiryTime && Number(expiryTime) < Date.now()) {
        disconnect();
      }
    };

    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, []);

  const connect = async (method?: 'callback' | 'offline') => {
    if (!method) {
      setShowAuthSelector(true);
      return;
    }

    setShowAuthSelector(false);
    try {
      if (method === 'callback') {
        await dropboxAuth.connectWithCallback();
      } else {
        await dropboxAuth.connectWithOfflineAccess();
      }
      setIsAuthenticated(true);
      toast.success('Successfully connected to Dropbox');
    } catch (error) {
      console.error('Dropbox connection error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to connect to Dropbox');
    }
  };

  const disconnect = () => {
    dropboxAuth.disconnect();
    setIsAuthenticated(false);
    toast.success('Disconnected from Dropbox');
  };

  return (
    <DropboxContext.Provider value={{ 
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