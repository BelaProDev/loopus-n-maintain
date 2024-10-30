import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export function useDropboxAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('dropbox_access_token'));
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = useCallback(async () => {
    try {
      const token = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
      if (!token) {
        throw new Error('Dropbox access token not configured');
      }
      localStorage.setItem('dropbox_access_token', token);
      setIsAuthenticated(true);
    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: 'Failed to authenticate with Dropbox',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const logout = useCallback(() => {
    localStorage.removeItem('dropbox_access_token');
    setIsAuthenticated(false);
    toast({
      title: 'Logged out',
      description: 'Successfully logged out from Dropbox',
    });
  }, [toast]);

  return {
    isAuthenticated,
    login,
    logout
  };
}