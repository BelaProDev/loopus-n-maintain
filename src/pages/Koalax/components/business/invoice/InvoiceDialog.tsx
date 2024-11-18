import { Invoice } from "@/types/invoice";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import InvoiceForm from "./form/InvoiceForm";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingInvoice: Invoice | null;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

const InvoiceDialog = ({
  isOpen,
  onOpenChange,
  editingInvoice,
  onSubmit,
  isLoading,
}: InvoiceDialogProps) => {
  const { t } = useTranslation(["admin", "common"]);

  const formattedInvoice = editingInvoice ? {
    ...editingInvoice,
    paymentTerms: editingInvoice.paymentTerms || 'net30',
    currency: editingInvoice.currency || 'EUR'
  } : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full h-screen inset-0 p-0">
        <div className="h-full flex flex-col bg-background">
          {/* Header */}
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">
              {editingInvoice ? t("admin:business.invoices.edit") : t("admin:business.invoices.add")}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="max-w-5xl mx-auto">
              <InvoiceForm
                editingInvoice={formattedInvoice}
                onSubmit={onSubmit}
                isLoading={isLoading}
                onCancel={() => onOpenChange(false)}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;