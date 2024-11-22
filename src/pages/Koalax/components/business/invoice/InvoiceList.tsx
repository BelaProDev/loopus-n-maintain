import { useState } from "react";
import { useInvoiceList } from "./hooks/useInvoiceList";
import { useInvoiceOperations } from "@/hooks/useInvoiceOperations";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import InvoiceDialog from "./InvoiceDialog";
import InvoiceToolbar from "./InvoiceToolbar";
import InvoiceListContent from "./InvoiceListContent";
import { Invoice } from "@/types/invoice";
import { Loader2 } from "lucide-react";

const InvoiceList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const { t } = useTranslation(["admin", "common"]);
  const { toast } = useToast();
  const { handleCreateInvoice, handleUpdateInvoice, deleteMutation, isCreating, isUpdating } = useInvoiceOperations();
  const { invoices, isLoading } = useInvoiceList();

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsDialogOpen(true);
  };

  const handleDelete = (invoice: Invoice) => {
    if (!invoice.id) return;
    
    deleteMutation.mutate(invoice.id, {
      onSuccess: () => {
        toast({
          title: t("common:status.success"),
          description: t("admin:business.invoices.deleteSuccess")
        });
      },
      onError: () => {
        toast({
          title: t("common:status.error"),
          description: t("admin:business.invoices.deleteError"),
          variant: "destructive"
        });
      }
    });
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (editingInvoice) {
        await handleUpdateInvoice(editingInvoice.id, formData);
        toast({
          title: t("common:status.success"),
          description: t("admin:business.invoices.updateSuccess")
        });
      } else {
        await handleCreateInvoice(formData);
        toast({
          title: t("common:status.success"),
          description: t("admin:business.invoices.createSuccess")
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: t("common:status.error"),
        description: t("admin:business.invoices.submitError"),
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <InvoiceToolbar
        onImportClick={() => {}}
        onCreateClick={() => {
          setEditingInvoice(null);
          setIsDialogOpen(true);
        }}
      />

      <InvoiceListContent
        invoices={invoices}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <InvoiceDialog
        isOpen={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingInvoice(null);
        }}
        editingInvoice={editingInvoice}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
};

export default InvoiceList;