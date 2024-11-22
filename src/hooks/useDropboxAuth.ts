import { useState, useCallback } from 'react';
import { dropboxAuth } from '@/lib/auth/dropboxAuth';
import { toast } from 'sonner';

export function useDropboxAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async () => {
    setIsLoading(true);
    try {
      await dropboxAuth.initializeAuth();
      toast.success('Successfully connected to Dropbox');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    dropboxAuth.logout();
  }, []);

  return {
    isLoading,
    isAuthenticated: dropboxAuth.isAuthenticated(),
    login,
    logout
  };
}