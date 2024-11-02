import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import fallbackDb from "@/lib/fallback-db.json";

const KoalaxAuth = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const storedPassword = fallbackDb.settings.find(s => s.key === "koalax_password")?.value;
      const isValid = password === storedPassword;
      
      if (isValid) {
        sessionStorage.setItem('koalax_auth', 'true');
        navigate('/koalax/emails');
        toast({
          title: t("common.success"),
          description: t("admin.auth.welcomeMessage"),
        });
      } else {
        toast({
          title: t("common.error"),
          description: t("admin.auth.invalidPassword"),
          variant: "destructive",
        });
        setPassword("");
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.auth.error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">{t("admin.auth.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("admin.auth.passwordPlaceholder")}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("common.loading") : t("admin.auth.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default KoalaxAuth;