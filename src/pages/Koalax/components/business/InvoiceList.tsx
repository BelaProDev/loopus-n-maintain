import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import InvoiceDialog from "./invoice/InvoiceDialog";
import ImportInvoiceDialog from "@/components/business/invoice/ImportInvoiceDialog";
import { useTranslation } from "react-i18next";
import { useInvoiceOperations } from "@/hooks/useInvoiceOperations";
import InvoiceTable from "./invoice/InvoiceTable";
import InvoiceToolbar from "./invoice/InvoiceToolbar";
import { useToast } from "@/components/ui/use-toast";
import type { Invoice } from "@/types/invoice";
import { useNavigate } from "react-router-dom";

const InvoiceList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const { t } = useTranslation(["admin", "common"]);
  const { handleCreateInvoice, handleUpdateInvoice, deleteMutation, isCreating, isUpdating } = useInvoiceOperations();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleSubmit = async (formData: FormData) => {
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
      toast({
        title: t("common:common.error"),
        description: t("admin:business.invoices.submitError"),
        variant: "destructive"
      });
    }
  };

  const handleEdit = (invoice: Invoice) => {
    navigate(`/admin/business/invoices/${invoice.id}`);
  };

  return (
    <div className="space-y-4">
      <InvoiceToolbar 
        onCreateClick={() => navigate("/admin/business/invoices/new")}
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