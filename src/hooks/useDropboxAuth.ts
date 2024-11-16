import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch } from './useAppStore';
import { setAuthenticated } from '@/store/slices/documentsSlice';

export function useDropboxAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const login = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
      if (!token) {
        throw new Error('Dropbox access token not configured');
      }
      localStorage.setItem('dropbox_access_token', token);
      dispatch(setAuthenticated(true));
      setIsAuthenticatedState(true);
      toast({
        title: 'Success',
        description: 'Successfully connected to Dropbox',
      });
    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: 'Failed to authenticate with Dropbox',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, dispatch]);

  const logout = useCallback(() => {
    localStorage.removeItem('dropbox_access_token');
    dispatch(setAuthenticated(false));
    setIsAuthenticatedState(false);
    toast({
      title: 'Logged out',
      description: 'Successfully logged out from Dropbox',
    });
  }, [toast, dispatch]);

  return {
    isLoading,
    isAuthenticated,
    login,
    logout
  };
}