import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";

interface InvoiceFooterProps {
  formData: {
    notes: string;
    currency: string;
  };
  totals: {
    subtotal: number;
    tax: number;
    total: number;
  };
  onChange: (name: string, value: string) => void;
}

const InvoiceFooter = ({ formData, totals, onChange }: InvoiceFooterProps) => {
  const { t } = useTranslation(["admin"]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="p-6 bg-muted/5 border-primary/20">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">
              {t("admin:business.invoices.notes")}
            </h3>
          </div>
          <Textarea
            name="notes"
            placeholder={t("admin:business.invoices.notesPlaceholder")}
            value={formData.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            rows={6}
            className="resize-none text-base min-h-[160px]"
          />
        </div>
      </Card>

      <Card className="p-6 bg-primary/5 border-primary">
        <div className="space-y-6">
          <div className="flex justify-between items-center text-base">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-mono text-lg">
              {totals.subtotal.toFixed(2)} {formData.currency}
            </span>
          </div>
          <div className="flex justify-between items-center text-base">
            <span className="text-muted-foreground">Tax (21%):</span>
            <span className="font-mono text-lg">
              {totals.tax.toFixed(2)} {formData.currency}
            </span>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">Total:</span>
            <span className="font-mono text-2xl font-bold text-primary">
              {totals.total.toFixed(2)} {formData.currency}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceFooter;