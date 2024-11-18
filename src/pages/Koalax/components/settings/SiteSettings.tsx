import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Settings } from "lucide-react";

const SiteSettings = () => {
  const { t } = useTranslation(["admin"]);
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'whatsapp';

  const handleTabChange = (value: string) => {
    navigate(`/admin/settings/${value}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">{t("admin:settings.title")}</h1>
      </div>
      
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="whatsapp">
            {t("admin:settings.tabs.whatsapp")}
          </TabsTrigger>
          <TabsTrigger value="logo">
            {t("admin:settings.tabs.logo")}
          </TabsTrigger>
        </TabsList>

        <Card className="p-6">
          <Outlet />
        </Card>
      </Tabs>
    </div>
  );
};

export default SiteSettings;