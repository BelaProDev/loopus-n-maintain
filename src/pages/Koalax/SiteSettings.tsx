import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import WhatsAppSettings from "./components/WhatsAppSettings";
import LogoSettings from "./components/LogoSettings";
import { useTranslation } from "react-i18next";

const SiteSettings = () => {
  const { t } = useTranslation(["admin"]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("admin:settings.title")}</h1>
      
      <Tabs defaultValue="whatsapp" className="space-y-4">
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