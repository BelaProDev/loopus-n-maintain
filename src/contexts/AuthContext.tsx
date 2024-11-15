import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { authQueries } from "@/lib/fauna/authQueries";

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const session = localStorage.getItem('craft_coordination_session');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        if (sessionData.email) {
          setIsAuthenticated(true);
          setUserEmail(sessionData.email);
          return true;
        }
      } catch (error) {
        localStorage.removeItem('craft_coordination_session');
      }
    }
    return false;
  };

  const login = async (email: string, password: string) => {
    const user = await authQueries.validateUser(email, password);

    if (user) {
      setIsAuthenticated(true);
      setUserEmail(user.email);
      
      const sessionData = {
        email: user.email,
        timestamp: Date.now()
      };
      
      localStorage.setItem('craft_coordination_session', JSON.stringify(sessionData));
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem('craft_coordination_session');
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userEmail,
      login, 
      logout, 
      checkAuth 
    }}>
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