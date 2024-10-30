import { Phone, Image, Link2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WhatsAppSettings from "./components/WhatsAppSettings";
import LogoSettings from "./components/LogoSettings";
import NavigationSettings from "./components/NavigationSettings";

const SiteSettings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Site Settings</h1>
      
      <Tabs defaultValue="whatsapp" className="space-y-4">
        <TabsList>
          <TabsTrigger value="whatsapp">
            <Phone className="w-4 h-4 mr-2" />
            WhatsApp Numbers
          </TabsTrigger>
          <TabsTrigger value="logo">
            <Image className="w-4 h-4 mr-2" />
            Logo
          </TabsTrigger>
          <TabsTrigger value="links">
            <Link2 className="w-4 h-4 mr-2" />
            Navigation Links
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