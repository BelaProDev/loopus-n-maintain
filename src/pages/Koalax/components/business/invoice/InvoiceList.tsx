import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { useInvoiceOperations } from "@/hooks/useInvoiceOperations";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import InvoiceDialog from "./InvoiceDialog";
import InvoiceToolbar from "./InvoiceToolbar";
import InvoiceTable from "./InvoiceTable";
import { Invoice } from "@/types/invoice";
import { Loader2 } from "lucide-react";

const InvoiceList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const { t } = useTranslation(["admin", "common"]);
  const { toast } = useToast();
  const { handleCreateInvoice, handleUpdateInvoice, deleteMutation, isCreating, isUpdating } = useInvoiceOperations();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: businessQueries.getInvoices,
  });

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

      <InvoiceTable
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