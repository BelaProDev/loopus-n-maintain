import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import MessageList from "./MessageList";

const SERVICES = ['electrics', 'plumbing', 'woodwork', 'ironwork', 'architecture'] as const;

const MessageManagement = () => {
  const { t } = useTranslation(["admin", "services"]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("admin:messages.title")}</h1>
      
      <Tabs defaultValue="electrics" className="space-y-4">
        <TabsList>
          {SERVICES.map((service) => (
            <TabsTrigger key={service} value={service}>
              {t(`services:${service}.title`)}
            </TabsTrigger>
          ))}
        </TabsList>

        {SERVICES.map((service) => (
          <TabsContent key={service} value={service}>
            <MessageList service={service} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MessageManagement;