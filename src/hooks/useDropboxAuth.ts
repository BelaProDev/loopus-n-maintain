import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch } from './useAppStore';
import { setAuthenticated } from '@/store/slices/documentsSlice';
import { dropboxAuth } from '@/lib/auth/dropbox';

export function useDropboxAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await dropboxAuth.getValidAccessToken();
      if (token) {
        dispatch(setAuthenticated(true));
        setIsAuthenticatedState(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  };

  const login = useCallback(async () => {
    setIsLoading(true);
    try {
      await dropboxAuth.initiateAuth();
    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: 'Failed to authenticate with Dropbox',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const logout = useCallback(() => {
    localStorage.removeItem('dropbox_state');
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