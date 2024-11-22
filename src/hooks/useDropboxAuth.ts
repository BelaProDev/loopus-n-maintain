import { useState } from 'react';
import { dropboxAuth } from '@/lib/auth/dropboxAuth';

export function useDropboxAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    setIsLoading(true);
    try {
      await dropboxAuth.initializeAuth();
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isAuthenticated: dropboxAuth.isAuthenticated(),
    login,
    logout: dropboxAuth.logout.bind(dropboxAuth)
  };
}