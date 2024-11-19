import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt, Users, UserCog } from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BusinessManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(["admin"]);
  
  // Extract the current tab from the URL path
  const currentTab = location.pathname.split('/').pop() || 'invoices';

  const handleTabChange = (value: string) => {
    navigate(`/admin/business/${value}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("admin:business.title")}
        </h1>
      </div>
      
      <div className="bg-background rounded-lg border shadow-sm">
        <Tabs 
          defaultValue={currentTab} 
          value={currentTab} 
          onValueChange={handleTabChange} 
          className="w-full"
        >
          <TabsList className="w-full justify-start border-b bg-muted/50 p-0 h-auto">
            <TabsTrigger 
              value="invoices"
              className="flex items-center px-4 py-3 data-[state=active]:bg-background data-[state=active]:shadow-none"
            >
              <Receipt className="w-4 h-4 mr-2" />
              {t("admin:business.invoices.title")}
            </TabsTrigger>
            <TabsTrigger 
              value="clients"
              className="flex items-center px-4 py-3 data-[state=active]:bg-background data-[state=active]:shadow-none"
            >
              <Users className="w-4 h-4 mr-2" />
              {t("admin:business.clients.title")}
            </TabsTrigger>
            <TabsTrigger 
              value="providers"
              className="flex items-center px-4 py-3 data-[state=active]:bg-background data-[state=active]:shadow-none"
            >
              <UserCog className="w-4 h-4 mr-2" />
              {t("admin:business.providers.title")}
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <Outlet />
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessManagement;