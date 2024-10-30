import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const session = localStorage.getItem('craft_coordination_session');
    const isValid = !!session;
    setIsAuthenticated(isValid);
    
    // Redirect to login if trying to access admin without auth
    if (!isValid && window.location.pathname.startsWith('/koalax-admin')) {
      navigate('/login');
    }
    
    return isValid;
  };

  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement real authentication
      setIsAuthenticated(true);
      localStorage.setItem('craft_coordination_session', 'true');
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('craft_coordination_session');
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};