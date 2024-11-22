import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { adminQueries } from "@/lib/fauna/adminQueries";

export const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(["auth"]);

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const admin = await adminQueries.validateAdmin(data.email, data.password);
      
      if (admin) {
        const sessionData = {
          timestamp: Date.now(),
          type: 'koalax',
          isAuthenticated: true,
          email: admin.email
        };
        
        sessionStorage.setItem('koalax_auth', JSON.stringify(sessionData));
        
        const from = location.state?.from?.pathname || "/admin/emails";
        navigate(from, { replace: true });
        
        toast({
          title: t("loginSuccess"),
          description: t("welcomeBack"),
        });
      } else {
        toast({
          title: t("loginFailed"),
          description: t("invalidCredentials"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: t("loginFailed"),
        description: t("invalidCredentials"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
    isLoading
  };
};