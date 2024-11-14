import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { SHA256 } from 'crypto-js';
import { settingsQueries } from '@/lib/fauna';

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    const session = sessionStorage.getItem('craft_coordination_session');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        setAuthState({
          isAuthenticated: true,
          user: sessionData.user,
        });
      } catch (error) {
        console.error('Session parse error:', error);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const hashedPassword = SHA256(password).toString();
      const users = await settingsQueries.getUsers();
      const user = users.find(u => u.email === email && u.password === hashedPassword);

      if (user) {
        const sessionData = {
          user: email,
          timestamp: Date.now(),
        };
        sessionStorage.setItem('craft_coordination_session', JSON.stringify(sessionData));
        setAuthState({
          isAuthenticated: true,
          user: email,
        });
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('craft_coordination_session');
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
    toast({
      title: "Success",
      description: "Successfully logged out",
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
};