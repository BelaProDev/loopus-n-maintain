import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import InvoiceDialog from "./InvoiceDialog";
import ImportInvoiceDialog from "@/components/business/invoice/ImportInvoiceDialog";
import { useTranslation } from "react-i18next";
import { useInvoiceOperations } from "@/hooks/useInvoiceOperations";
import InvoiceTable from "./InvoiceTable";
import InvoiceToolbar from "./InvoiceToolbar";
import { useToast } from "@/components/ui/use-toast";
import type { Invoice } from "@/types/invoice";

const InvoiceList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const { t } = useTranslation(["admin", "common"]);
  const { handleCreateInvoice, handleUpdateInvoice, deleteMutation, isCreating, isUpdating } = useInvoiceOperations();
  const { toast } = useToast();

  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await businessQueries.getInvoices();
      if (!response) {
        throw new Error('Failed to fetch invoices');
      }
      return response;
    }
  });

  if (error) {
    toast({
      title: t("common:common.error"),
      description: t("admin:business.invoices.fetchError"),
      variant: "destructive"
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      if (editingInvoice) {
        await handleUpdateInvoice(editingInvoice.id, formData);
      } else {
        await handleCreateInvoice(formData);
      }
      setIsDialogOpen(false);
      setEditingInvoice(null);
    } catch (error) {
      console.error('Error submitting invoice:', error);
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <InvoiceToolbar 
        onCreateClick={() => {
          setEditingInvoice(null);
          setIsDialogOpen(true);
        }}
        onImportClick={() => setIsImportDialogOpen(true)}
      />

      {isLoading ? (
        <div className="text-center py-4">{t("common:common.loading")}</div>
      ) : (
        <InvoiceTable 
          invoices={invoices}
          onDelete={(id) => deleteMutation.mutate(id)}
          onEdit={handleEdit}
        />
      )}

      <InvoiceDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingInvoice={editingInvoice}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      />

      <ImportInvoiceDialog
        isOpen={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
      />
    </div>
  );
};

export default InvoiceList;