import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface InvoiceHeaderProps {
  formData: {
    number: string;
    date: string;
    dueDate: string;
  };
  onChange: (name: string, value: string) => void;
}

const InvoiceHeader = ({ formData, onChange }: InvoiceHeaderProps) => {
  const { t } = useTranslation(["admin"]);

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t("admin:business.invoices.number")}
          </label>
          <Input
            name="number"
            value={formData.number}
            onChange={(e) => onChange("number", e.target.value)}
            readOnly
            className="bg-gray-50 font-mono"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t("admin:business.invoices.date")}
          </label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => onChange("date", e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t("admin:business.invoices.dueDate")}
          </label>
          <Input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={(e) => onChange("dueDate", e.target.value)}
            className="font-mono"
          />
        </div>
      </div>
    </Card>
  );
};

export default InvoiceHeader;