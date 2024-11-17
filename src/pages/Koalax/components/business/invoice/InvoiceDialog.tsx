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
      <DialogContent className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
            {editingInvoice ? t("admin:business.invoices.edit") : t("admin:business.invoices.add")}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {editingInvoice 
              ? t("admin:business.invoices.editDescription") 
              : t("admin:business.invoices.addDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <InvoiceForm
            editingInvoice={editingInvoice}
            onSubmit={onSubmit}
            isLoading={isLoading}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;