import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch } from './useAppStore';
import { setAuthenticated } from '@/store/slices/documentsSlice';

interface DropboxTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'bearer';
}

export function useDropboxAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const tokens = localStorage.getItem('dropbox_tokens');
    if (tokens) {
      try {
        const parsedTokens = JSON.parse(tokens);
        const expiryTime = localStorage.getItem('dropbox_token_expiry');
        
        if (expiryTime && Number(expiryTime) > Date.now()) {
          dispatch(setAuthenticated(true));
          setIsAuthenticatedState(true);
          return true;
        }
      } catch (error) {
        localStorage.removeItem('dropbox_tokens');
      }
    }
    return false;
  };

  const login = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/.netlify/functions/dropbox-auth');
      const { authUrl, state } = await response.json();
      
      localStorage.setItem('dropbox_state', state);
      
      const popup = window.open(authUrl, 'Dropbox Auth', 'width=800,height=600');
      
      const handleCallback = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'DROPBOX_AUTH_CALLBACK') {
          const { code, state: returnedState } = event.data;
          
          const savedState = localStorage.getItem('dropbox_state');
          if (returnedState !== savedState) {
            throw new Error('Invalid state parameter');
          }
          
          const tokenResponse = await fetch('/.netlify/functions/dropbox-auth', {
            method: 'POST',
            body: JSON.stringify({ code }),
          });
          
          const tokens: DropboxTokens = await tokenResponse.json();
          
          localStorage.setItem('dropbox_tokens', JSON.stringify(tokens));
          localStorage.setItem('dropbox_token_expiry', String(Date.now() + (tokens.expires_in * 1000)));
          
          dispatch(setAuthenticated(true));
          setIsAuthenticatedState(true);
          
          if (popup) popup.close();
          
          toast({
            title: 'Success',
            description: 'Successfully connected to Dropbox',
          });
        }
      };
      
      window.addEventListener('message', handleCallback);
      return () => window.removeEventListener('message', handleCallback);
      
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: 'Authentication Error',
        description: error instanceof Error ? error.message : 'Failed to authenticate',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, dispatch]);

  const logout = useCallback(() => {
    localStorage.removeItem('dropbox_tokens');
    localStorage.removeItem('dropbox_token_expiry');
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