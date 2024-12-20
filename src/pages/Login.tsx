import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { t } = useTranslation(["common", "auth"]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      const from = location.state?.from?.pathname || "/";
      // Use replace instead of push to avoid history stack issues
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: t("auth:loginFailed"),
        description: t("auth:invalidCredentials"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect with replace if already authenticated
  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1EA] relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4"
        onClick={() => navigate("/")}
      >
        <Home className="mr-2 h-4 w-4" />
        {t("common:nav.home")}
      </Button>
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-[#2E5984]">{t("auth:welcome")}</CardTitle>
          <CardDescription>{t("auth:accessAccount")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth:email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("auth:email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="px-4 py-3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth:password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t("auth:password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="px-4 py-3"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("common:common.loading") : t("auth:signIn")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;