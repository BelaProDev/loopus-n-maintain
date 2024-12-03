import React, { createContext, useContext, useState, useEffect } from 'react';
import DropboxClient from '@/lib/api/dropboxClient';
import { useToast } from '@/components/ui/use-toast';
import type { DropboxContextType } from '@/types/dropbox';

const DropboxContext = createContext<DropboxContextType>({
  client: null,
  isAuthenticated: false,
  isInitializing: true,
  initialize: async () => {},
  connect: async () => {},
});

export const DropboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<DropboxClient | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();

  const initialize = async (token: string) => {
    try {
      const dropboxClient = DropboxClient.getInstance();
      await dropboxClient.initialize(token);
      setClient(dropboxClient);
    } catch (error) {
      console.error('Failed to initialize Dropbox client:', error);
      toast({
        title: "Error",
        description: "Failed to initialize Dropbox client",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const connect = async () => {
    try {
      const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${process.env.DROPBOX_APP_KEY}&response_type=token&redirect_uri=${window.location.origin}/callback`;
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to connect to Dropbox:', error);
      toast({
        title: "Error",
        description: "Failed to connect to Dropbox",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('dropbox_access_token');
    if (token) {
      initialize(token);
    } else {
      setIsInitializing(false);
    }
  }, []);

  const value = {
    client,
    isAuthenticated: client?.isInitialized() || false,
    isInitializing,
    initialize,
    connect,
  };

  return (
    <DropboxContext.Provider value={value}>
      {children}
    </DropboxContext.Provider>
  );
};

export const useDropbox = () => {
  const context = useContext(DropboxContext);
  if (!context) {
    throw new Error('useDropbox must be used within a DropboxProvider');
  }
  return context;
};