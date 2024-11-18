import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCog, Receipt } from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const BusinessManagement = () => {
  const { t } = useTranslation(["admin"]);
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'clients';

  useEffect(() => {
    if (location.pathname === '/admin/business') {
      navigate('/admin/business/clients');
    }
  }, [location.pathname, navigate]);

  const handleTabChange = (value: string) => {
    navigate(`/admin/business/${value}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("admin:business.title")}</h1>
        <div className="flex gap-2">
          {currentTab === 'clients' && (
            <Button onClick={() => navigate('/admin/business/clients/new')}>
              <Users className="w-4 h-4 mr-2" />
              {t("admin:business.clients.add")}
            </Button>
          )}
          {currentTab === 'providers' && (
            <Button onClick={() => navigate('/admin/business/providers/new')}>
              <UserCog className="w-4 h-4 mr-2" />
              {t("admin:providers.add")}
            </Button>
          )}
          {currentTab === 'invoices' && (
            <Button onClick={() => navigate('/admin/business/invoices/new')}>
              <Receipt className="w-4 h-4 mr-2" />
              {t("admin:business.invoices.add")}
            </Button>
          )}
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients">
            <Users className="w-4 h-4 mr-2" />
            {t("admin:business.clients.title")}
          </TabsTrigger>
          <TabsTrigger value="providers">
            <UserCog className="w-4 h-4 mr-2" />
            {t("admin:providers.title")}
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <Receipt className="w-4 h-4 mr-2" />
            {t("admin:business.invoices.title")}
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