import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { dropboxAuth } from '@/lib/auth/dropbox';
import { useToast } from '@/components/ui/use-toast';

export function useDropboxAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!dropboxAuth.getAccessToken());
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = useCallback(async () => {
    try {
      await dropboxAuth.initiateAuth();
    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: 'Failed to start authentication process',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleCallback = useCallback(async (code: string) => {
    try {
      await dropboxAuth.handleAuthCallback(code);
      setIsAuthenticated(true);
      toast({
        title: 'Success',
        description: 'Successfully authenticated with Dropbox',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: 'Failed to complete authentication',
        variant: 'destructive',
      });
    }
  }, [navigate, toast]);

  const logout = useCallback(() => {
    dropboxAuth.logout();
    setIsAuthenticated(false);
    toast({
      title: 'Logged out',
      description: 'Successfully logged out from Dropbox',
    });
  }, [toast]);

  return {
    isAuthenticated,
    login,
    handleCallback,
    logout
  };
}