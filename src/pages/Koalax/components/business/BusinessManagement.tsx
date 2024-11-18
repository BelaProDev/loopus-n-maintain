import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, UserCog, Receipt, GitGraph } from "lucide-react";
import ClientList from "./ClientList";
import ProviderList from "./ProviderList";
import InvoiceList from "./InvoiceList";
import ClientInvoiceRelationship from "./ClientInvoiceRelationship";
import { useTranslation } from "react-i18next";

const BusinessManagement = () => {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("admin:business.title")}</h1>
      
      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients">
            <Users className="w-4 h-4 mr-2" />
            {t("admin:business.clients.title")}
          </TabsTrigger>
          <TabsTrigger value="providers">
            <UserCog className="w-4 h-4 mr-2" />
            {t("admin:business.providers.title")}
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <Receipt className="w-4 h-4 mr-2" />
            {t("admin:business.invoices.title")}
          </TabsTrigger>
          <TabsTrigger value="relationships">
            <GitGraph className="w-4 h-4 mr-2" />
            {t("admin:business.relationships")}
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

        <TabsContent value="relationships">
          <Card className="p-6">
            <ClientInvoiceRelationship />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessManagement;