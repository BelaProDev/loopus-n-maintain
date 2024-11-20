import { Invoice } from "@/types/invoice";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import InvoiceForm from "./form/InvoiceForm";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const handleSubmit = async (formData: FormData) => {
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting invoice:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="dialog-content">
        <div className="dialog-header">
          <h1 className="dialog-title">
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

        <ScrollArea className="dialog-body">
          <div className="form-container">
            <InvoiceForm
              editingInvoice={formattedInvoice}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onCancel={() => onOpenChange(false)}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;