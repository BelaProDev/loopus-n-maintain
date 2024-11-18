import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import WhatsAppSettings from "./components/WhatsAppSettings";
import LogoSettings from "./components/LogoSettings";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const TABS = ['whatsapp', 'logo'] as const;
type TabType = typeof TABS[number];

const SiteSettings = () => {
  const { t } = useTranslation(["admin"]);
  const navigate = useNavigate();
  const { tab } = useParams<{ tab: TabType }>();
  
  useEffect(() => {
    if (!tab || !TABS.includes(tab as TabType)) {
      navigate("/admin/settings/whatsapp", { replace: true });
    }
  }, [tab, navigate]);

  const handleTabChange = (value: string) => {
    navigate(`/admin/settings/${value}`);
  };

  const currentTab = tab || 'whatsapp';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("admin:settings.title")}</h1>
      
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="whatsapp">
            {t("admin:settings.tabs.whatsapp")}
          </TabsTrigger>
          <TabsTrigger value="logo">
            {t("admin:settings.tabs.logo")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp">
          <Card className="p-6">
            <WhatsAppSettings />
          </Card>
        </TabsContent>

        <TabsContent value="logo">
          <Card className="p-6">
            <LogoSettings />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettings;