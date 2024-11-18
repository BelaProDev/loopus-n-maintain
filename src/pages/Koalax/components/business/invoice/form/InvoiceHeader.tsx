import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Building2 } from "lucide-react";

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
          <Building2 className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">INVOICE</h1>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-primary">
            #{formData.number}
          </div>
        </div>
      </div>

      <Card className="p-6 bg-muted/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
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
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
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
    </div>
  );
};

export default InvoiceHeader;