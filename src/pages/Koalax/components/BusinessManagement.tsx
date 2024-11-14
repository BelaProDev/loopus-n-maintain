import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCog, Receipt, Database } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ClientList from "./business/ClientList";
import ProviderList from "./business/ProviderList";
import InvoiceList from "./business/InvoiceList";
import { migrateData } from "@/lib/mockMigration";

const BusinessManagement = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const { toast } = useToast();

  const handleMigration = async () => {
    setIsMigrating(true);
    try {
      await migrateData();
      toast({
        title: "Success",
        description: "Mock data has been migrated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to migrate mock data",
        variant: "destructive",
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Business Management</h1>
        <Button 
          onClick={handleMigration} 
          disabled={isMigrating}
          variant="outline"
        >
          <Database className="w-4 h-4 mr-2" />
          {isMigrating ? "Migrating..." : "Migrate Mock Data"}
        </Button>
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