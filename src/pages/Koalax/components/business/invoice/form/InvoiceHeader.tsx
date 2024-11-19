import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <FileText className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">INVOICE</h1>
            <p className="text-sm text-gray-500 mt-1">{t("admin:business.invoices.createNew")}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-primary">
            #{formData.number}
          </div>
        </div>
      </div>

      <Card className="p-6 bg-gray-50/50 border border-gray-200/60">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              {t("admin:business.invoices.date")}
            </label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) => onChange("date", e.target.value)}
              className="font-mono bg-white"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              {t("admin:business.invoices.dueDate")}
            </label>
            <Input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={(e) => onChange("dueDate", e.target.value)}
              className="font-mono bg-white"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceHeader;