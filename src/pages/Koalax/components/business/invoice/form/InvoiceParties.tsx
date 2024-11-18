import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Client, Provider } from "@/types/business";
import { useTranslation } from "react-i18next";
import { Building, Building2 } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="p-6 bg-muted/5 border-primary/20">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">
              {t("admin:business.invoices.provider")}
            </h3>
          </div>
          <Select
            name="providerId"
            value={formData.providerId}
            onValueChange={(value) => onChange("providerId", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t("admin:business.invoices.selectProvider") as string} />
            </SelectTrigger>
            <SelectContent>
              {providers?.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {providers.find(p => p.id === formData.providerId) && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{providers.find(p => p.id === formData.providerId)?.address}</p>
              <p>{providers.find(p => p.id === formData.providerId)?.email}</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-muted/5 border-primary/20">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Building className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">
              {t("admin:business.invoices.client")}
            </h3>
          </div>
          <Select
            name="clientId"
            value={formData.clientId}
            onValueChange={(value) => onChange("clientId", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t("admin:business.invoices.selectClient") as string} />
            </SelectTrigger>
            <SelectContent>
              {clients?.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {clients.find(c => c.id === formData.clientId) && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{clients.find(c => c.id === formData.clientId)?.address}</p>
              <p>{clients.find(c => c.id === formData.clientId)?.email}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InvoiceParties;