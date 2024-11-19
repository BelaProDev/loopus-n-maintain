import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClientList from "./ClientList";
import ProviderList from "./ProviderList";
import InvoiceList from "./InvoiceList";

const BusinessManagement = () => {
  const { t } = useTranslation(["admin"]);
  const navigate = useNavigate();

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: businessQueries.getClients
  });

  const { data: providers = [] } = useQuery({
    queryKey: ['providers'],
    queryFn: businessQueries.getProviders
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: businessQueries.getInvoices
  });

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("admin:business.title")}
        </h1>
        <div className="space-x-4">
          <Button 
            variant="outline"
            onClick={() => navigate("/admin/business/invoices/new")}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("admin:business.invoices.add")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Clients Section */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-blue-900">
              {t("admin:business.clients.title")}
            </h2>
            <span className="text-sm text-blue-600 font-medium">
              {clients.length} {t("admin:business.clients.total")}
            </span>
          </div>
          <ClientList />
        </Card>

        {/* Providers Section */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-blue-900">
              {t("admin:business.providers.title")}
            </h2>
            <span className="text-sm text-blue-600 font-medium">
              {providers.length} {t("admin:business.providers.total")}
            </span>
          </div>
          <ProviderList />
        </Card>

        {/* Invoices Section - Full Width */}
        <Card className="p-6 bg-blue-50 border-blue-200 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-blue-900">
              {t("admin:business.invoices.title")}
            </h2>
            <span className="text-sm text-blue-600 font-medium">
              {invoices.length} {t("admin:business.invoices.total")}
            </span>
          </div>
          <InvoiceList />
        </Card>
      </div>
    </div>
  );
};

export default BusinessManagement;