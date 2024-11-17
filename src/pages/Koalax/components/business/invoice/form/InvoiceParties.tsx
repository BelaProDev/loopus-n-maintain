import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Client, Provider } from "@/types/business";
import { useTranslation } from "react-i18next";

interface InvoicePartiesProps {
  formData: {
    clientId: string;
    providerId: string;
  };
  clients: Client[];
  providers: Provider[];
  onChange: (name: string, value: string) => void;
}

const InvoiceParties = ({ formData, clients, providers, onChange }: InvoicePartiesProps) => {
  const { t } = useTranslation(["admin"]);

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t("admin:business.invoices.client")}
          </label>
          <Select
            name="clientId"
            value={formData.clientId}
            onValueChange={(value) => onChange("clientId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("admin:business.invoices.selectClient")} />
            </SelectTrigger>
            <SelectContent>
              {clients?.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t("admin:business.invoices.provider")}
          </label>
          <Select
            name="providerId"
            value={formData.providerId}
            onValueChange={(value) => onChange("providerId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("admin:business.invoices.selectProvider")} />
            </SelectTrigger>
            <SelectContent>
              {providers?.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};

export default InvoiceParties;