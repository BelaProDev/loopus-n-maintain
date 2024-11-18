import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import MessageList from "./MessageList";
import { ContactMessage } from "@/lib/fauna/types";

const SERVICES: ContactMessage['service'][] = ['electrics', 'plumbing', 'woodwork', 'ironwork', 'architecture'];

const MessageManagement = () => {
  const { t } = useTranslation(["admin", "services"]);
  const navigate = useNavigate();
  const location = useLocation();
  const { service } = useParams();

  // Set default service if none is selected
  useEffect(() => {
    if (!service) {
      navigate(`/admin/messages/electrics`, { replace: true });
    }
  }, [service, navigate]);

  const currentService = service || 'electrics';

  const handleTabChange = (value: string) => {
    navigate(`/admin/messages/${value}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("admin:messages.title")}</h1>
      
      <Tabs value={currentService} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          {SERVICES.map((serviceType) => (
            <TabsTrigger key={serviceType} value={serviceType}>
              {t(`services:${serviceType}.title`)}
            </TabsTrigger>
          ))}
        </TabsList>

        {SERVICES.map((serviceType) => (
          <TabsContent key={serviceType} value={serviceType}>
            <MessageList service={serviceType} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MessageManagement;