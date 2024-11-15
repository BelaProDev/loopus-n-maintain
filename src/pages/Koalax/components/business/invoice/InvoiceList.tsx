import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import InvoiceDialog from "./InvoiceDialog";
import ImportInvoiceDialog from "./ImportInvoiceDialog";
import { useTranslation } from "react-i18next";
import { useInvoiceOperations } from "@/hooks/useInvoiceOperations";
import InvoiceTable from "./InvoiceTable";
import InvoiceToolbar from "./InvoiceToolbar";
import { useToast } from "@/components/ui/use-toast";

const InvoiceList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const { t } = useTranslation(["admin", "common"]);
  const { handleCreateInvoice, deleteMutation, isCreating } = useInvoiceOperations();
  const { toast } = useToast();

  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await businessQueries.getInvoices();
      if (!response) {
        throw new Error('Failed to fetch invoices');
      }
      return response.map(invoice => ({
        ...invoice,
        date: new Date(invoice.date).toISOString(),
        dueDate: new Date(invoice.dueDate).toISOString()
      }));
    }
  });

  if (error) {
    toast({
      title: t("common:common.error"),
      description: t("admin:business.invoices.fetchError"),
      variant: "destructive"
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const isPending = handleCreateInvoice(formData);
    if (!isPending) {
      setIsDialogOpen(false);
    }
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
        />
      )}

      <InvoiceDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingInvoice={editingInvoice}
        onSubmit={handleSubmit}
        isLoading={isCreating}
      />

      <ImportInvoiceDialog
        isOpen={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
      />
    </div>
  );
};

export default InvoiceList;