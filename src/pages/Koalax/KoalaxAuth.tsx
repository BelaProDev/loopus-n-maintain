import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const KoalaxAuth = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(["common", "admin", "auth"]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !password) return;
    
    setIsLoading(true);
    
    try {
      if (password === import.meta.env.VITE_KOALAX_PASSWORD) {
        const sessionData = {
          timestamp: Date.now(),
          type: 'koalax',
          isAuthenticated: true
        };
        
        sessionStorage.setItem('koalax_auth', JSON.stringify(sessionData));
        
        // Navigate to the intended page or default to emails
        const from = location.state?.from?.pathname || "/koalax/emails";
        navigate(from, { replace: true });
      } else {
        throw new Error("Invalid password");
      }
    } catch (error) {
      toast({
        title: t("auth:loginFailed"),
        description: t("auth:invalidCredentials"),
        variant: "destructive",
      });
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{t("admin:auth.title")}</CardTitle>
          <CardDescription>{t("admin:auth.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth:password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="px-4 py-3"
                autoComplete="current-password"
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !password}
              aria-busy={isLoading}
            >
              {isLoading ? t("common:common.loading") : t("auth:signIn")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default KoalaxAuth;