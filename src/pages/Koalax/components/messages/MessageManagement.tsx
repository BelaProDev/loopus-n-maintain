import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { MessageSquare } from "lucide-react";

const MessageManagement = () => {
  const { t } = useTranslation(["admin", "services"]);
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'electrics';

  const handleTabChange = (value: string) => {
    navigate(`/admin/messages/${value}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-6 w-6" />
        <h1 className="text-3xl font-bold">{t("admin:messages.title")}</h1>
      </div>
      
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="electrics">
            {t("services:electrical.title")}
          </TabsTrigger>
          <TabsTrigger value="plumbing">
            {t("services:plumbing.title")}
          </TabsTrigger>
          <TabsTrigger value="ironwork">
            {t("services:ironwork.title")}
          </TabsTrigger>
          <TabsTrigger value="woodwork">
            {t("services:woodwork.title")}
          </TabsTrigger>
          <TabsTrigger value="architecture">
            {t("services:architecture.title")}
          </TabsTrigger>
        </TabsList>

        <Card className="p-6">
          <Outlet />
        </Card>
      </Tabs>
    </div>
  );
};

export default MessageManagement;