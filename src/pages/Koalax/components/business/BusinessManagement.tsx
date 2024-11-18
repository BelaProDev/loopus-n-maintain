import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Receipt, Users, UserCog } from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const BusinessManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(["admin"]);
  
  const currentTab = location.pathname.split('/').pop() || 'invoices';

  useEffect(() => {
    if (location.pathname === '/admin/business') {
      navigate('/admin/business/invoices');
    }
  }, [location.pathname, navigate]);

  const handleTabChange = (value: string) => {
    navigate(`/admin/business/${value}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("admin:business.title")}
        </h1>
      </div>
      
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="bg-card">
          <TabsTrigger value="invoices" className="data-[state=active]:bg-primary/10">
            <Receipt className="w-4 h-4 mr-2" />
            {t("admin:business.invoices.title")}
          </TabsTrigger>
          <TabsTrigger value="clients" className="data-[state=active]:bg-primary/10">
            <Users className="w-4 h-4 mr-2" />
            {t("admin:business.clients.title")}
          </TabsTrigger>
          <TabsTrigger value="providers" className="data-[state=active]:bg-primary/10">
            <UserCog className="w-4 h-4 mr-2" />
            {t("admin:business.providers.title")}
          </TabsTrigger>
        </TabsList>

        <Card className="p-6">
          <Outlet />
        </Card>
      </Tabs>
    </div>
  );
};

export default BusinessManagement;