import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, UserCog, Receipt } from "lucide-react";
import { useNavigate, useLocation, Outlet, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import InvoiceList from "./invoice/InvoiceList";
import InvoicePage from "./invoice/InvoicePage";
import ClientList from "./ClientList";
import ProviderList from "./ProviderList";

const BusinessManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Business Management</h1>
      </div>
      
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients">
            <Users className="w-4 h-4 mr-2" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="providers">
            <UserCog className="w-4 h-4 mr-2" />
            Providers
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <Receipt className="w-4 h-4 mr-2" />
            Invoices
          </TabsTrigger>
        </TabsList>

        <Card className="p-6">
          <Routes>
            <Route index element={<InvoiceList />} />
            <Route path="clients" element={<ClientList />} />
            <Route path="providers" element={<ProviderList />} />
            <Route path="invoices" element={<InvoiceList />} />
            <Route path="invoices/new" element={<InvoicePage />} />
            <Route path="invoices/:invoiceId" element={<InvoicePage />} />
          </Routes>
        </Card>
      </Tabs>
    </div>
  );
};

export default BusinessManagement;