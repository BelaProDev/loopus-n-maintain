import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client, Provider } from "@/types/business";
import { useTranslation } from "react-i18next";

interface InvoiceFormSelectsProps {
  clientId: string;
  providerId: string;
  clients: Client[];
  providers: Provider[];
  onSelectChange: (name: string, value: string) => void;
}

const InvoiceFormSelects = ({
  clientId,
  providerId,
  clients,
  providers,
  onSelectChange
}: InvoiceFormSelectsProps) => {
  const { t } = useTranslation(["admin"]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("admin:invoices.client")}</label>
        <Select
          name="clientId"
          value={clientId}
          onValueChange={(value) => onSelectChange('clientId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("admin:invoices.selectClient")} />
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
        <label className="text-sm font-medium">{t("admin:invoices.provider")}</label>
        <Select
          name="providerId"
          value={providerId}
          onValueChange={(value) => onSelectChange('providerId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("admin:invoices.selectProvider")} />
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
  );
};

export default InvoiceFormSelects;