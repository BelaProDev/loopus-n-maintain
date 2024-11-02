import { Phone, Image, Link2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WhatsAppSettings from "./components/WhatsAppSettings";
import LogoSettings from "./components/LogoSettings";
import NavigationSettings from "./components/NavigationSettings";
import { useTranslation } from "react-i18next";

const SiteSettings = () => {
  const { t } = useTranslation(["admin"]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
      
      <Tabs defaultValue="whatsapp" className="space-y-4">
        <TabsList>
          <TabsTrigger value="whatsapp">
            <Phone className="w-4 h-4 mr-2" />
            {t("settings.tabs.whatsapp")}
          </TabsTrigger>
          <TabsTrigger value="logo">
            <Image className="w-4 h-4 mr-2" />
            {t("settings.tabs.logo")}
          </TabsTrigger>
          <TabsTrigger value="links">
            <Link2 className="w-4 h-4 mr-2" />
            {t("settings.tabs.navigation")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp">
          <WhatsAppSettings />
        </TabsContent>

        <TabsContent value="logo">
          <LogoSettings />
        </TabsContent>

        <TabsContent value="links">
          <Card className="p-6">
            <NavigationSettings />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettings;