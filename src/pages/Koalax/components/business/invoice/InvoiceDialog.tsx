import { Invoice } from "@/types/business";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import InvoiceForm from "./form/InvoiceForm";

interface InvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingInvoice: Invoice | null;
  onSubmit: (e: React.FormEvent) => void;
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border shadow-lg max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold">
            {editingInvoice ? t("admin:business.invoices.edit") : t("admin:business.invoices.add")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {editingInvoice 
              ? t("admin:business.invoices.editDescription") 
              : t("admin:business.invoices.addDescription")}
          </DialogDescription>
        </DialogHeader>
        <InvoiceForm
          editingInvoice={editingInvoice}
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;