import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AUTH_CONSTANTS, DROPBOX_ENDPOINTS } from '@/lib/constants/auth';
import type { DropboxTokens, AuthResponse } from '@/types/auth';

export const useDropboxAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { data: tokens } = useQuery({
    queryKey: ['dropbox-auth'],
    queryFn: async (): Promise<DropboxTokens | null> => {
      const storedTokens = localStorage.getItem(AUTH_CONSTANTS.DROPBOX_TOKEN_KEY);
      if (!storedTokens) return null;
      
      const parsedTokens = JSON.parse(storedTokens);
      const expiry = localStorage.getItem(AUTH_CONSTANTS.DROPBOX_EXPIRY_KEY);
      
      if (expiry && Number(expiry) > Date.now()) {
        return parsedTokens;
      }
      
      return null;
    },
  });

  const authMutation = useMutation({
    mutationFn: async (code: string): Promise<AuthResponse> => {
      const response = await fetch(DROPBOX_ENDPOINTS.AUTH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.tokens) {
        localStorage.setItem(AUTH_CONSTANTS.DROPBOX_TOKEN_KEY, JSON.stringify(data.tokens));
        if (data.tokens.expires_in) {
          localStorage.setItem(
            AUTH_CONSTANTS.DROPBOX_EXPIRY_KEY,
            String(Date.now() + (data.tokens.expires_in * 1000))
          );
        }
      }
    },
    onError: (error) => {
      toast.error('Authentication failed');
      console.error('Auth error:', error);
    },
  });

  const initiateAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(DROPBOX_ENDPOINTS.AUTH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initiate' }),
      });
      
      const { authUrl, state } = await response.json();
      if (!authUrl) throw new Error('Failed to get authentication URL');
      
      localStorage.setItem(AUTH_CONSTANTS.DROPBOX_STATE_KEY, state);
      window.location.href = authUrl;
    } catch (error) {
      toast.error('Failed to initiate authentication');
      console.error('Auth initiation error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_CONSTANTS.DROPBOX_TOKEN_KEY);
    localStorage.removeItem(AUTH_CONSTANTS.DROPBOX_EXPIRY_KEY);
    localStorage.removeItem(AUTH_CONSTANTS.DROPBOX_STATE_KEY);
    toast.success('Logged out successfully');
  }, []);

  return {
    isAuthenticated: !!tokens,
    isLoading,
    initiateAuth,
    handleCallback: authMutation.mutateAsync,
    logout,
  };
};