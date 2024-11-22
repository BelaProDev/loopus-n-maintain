import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "./components/auth/LoginForm";
import { useAdminAuth } from "./hooks/useAdminAuth";

const KoalaxAuth = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["common", "admin", "auth"]);
  const { handleLogin, isLoading } = useAdminAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-4">
      <div className="w-full max-w-[400px] space-y-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => navigate("/")}
        >
          <Home className="mr-2 h-4 w-4" />
          {t("common:nav.home")}
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("admin:auth.title")}</CardTitle>
            <CardDescription>{t("admin:auth.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KoalaxAuth;