import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import InvoiceList from "./InvoiceList";
import ClientList from "./ClientList";
import ProviderList from "./ProviderList";

const BusinessManagement = () => {
  const { t } = useTranslation(["admin"]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("admin:business.title")}</h1>
      </div>
      
      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">{t("admin:business.invoices.title")}</h2>
          <InvoiceList />
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">{t("admin:business.clients.title")}</h2>
          <ClientList />
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">{t("admin:providers.title")}</h2>
          <ProviderList />
        </Card>
      </div>
    </div>
  );
};

export default BusinessManagement;