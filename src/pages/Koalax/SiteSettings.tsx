import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { Settings } from "lucide-react";

const TABS = ['whatsapp', 'logo'] as const;
type TabType = typeof TABS[number];

const SiteSettings = () => {
  const { t } = useTranslation(["settings"]);
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
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">{t("title")}</h1>
      </div>
      
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="whatsapp">
            {t("whatsapp.title")}
          </TabsTrigger>
          <TabsTrigger value="logo">
            {t("logo.title")}
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