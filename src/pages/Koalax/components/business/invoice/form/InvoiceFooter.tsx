import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

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
    <Card className="p-6 bg-muted/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-base font-medium text-foreground">
            {t("admin:business.invoices.notes")}
          </label>
          <Textarea
            name="notes"
            placeholder={t("admin:business.invoices.notesPlaceholder")}
            value={formData.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            rows={6}
            className="resize-none text-base min-h-[160px]"
          />
        </div>
        <div className="space-y-6 p-6 bg-muted/5 rounded-lg">
          <div className="flex justify-between items-center text-base">
            <span className="font-medium">Subtotal:</span>
            <span className="font-mono text-lg">
              {totals.subtotal.toFixed(2)} {formData.currency}
            </span>
          </div>
          <div className="flex justify-between items-center text-base">
            <span className="font-medium">Tax (21%):</span>
            <span className="font-mono text-lg">
              {totals.tax.toFixed(2)} {formData.currency}
            </span>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span className="font-mono">
              {totals.total.toFixed(2)} {formData.currency}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InvoiceFooter;