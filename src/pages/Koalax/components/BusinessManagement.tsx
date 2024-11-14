import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, UserCog, Receipt } from "lucide-react";
import ClientList from "./business/ClientList";
import ProviderList from "./business/ProviderList";
import InvoiceList from "./business/InvoiceList";

const BusinessManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Business Management</h1>
      </div>
      
      <Tabs defaultValue="clients" className="space-y-4">
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

        <TabsContent value="clients">
          <Card className="p-6">
            <ClientList />
          </Card>
        </TabsContent>

        <TabsContent value="providers">
          <Card className="p-6">
            <ProviderList />
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card className="p-6">
            <InvoiceList />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessManagement;