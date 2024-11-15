import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import InvoiceDialog from "./invoice/InvoiceDialog";
import ImportInvoiceDialog from "./invoice/ImportInvoiceDialog";
import { useTranslation } from "react-i18next";
import { useInvoiceOperations } from "@/hooks/useInvoiceOperations";
import InvoiceTable from "./invoice/InvoiceTable";
import InvoiceToolbar from "./invoice/InvoiceToolbar";

const InvoiceList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const { t } = useTranslation(["admin", "common"]);
  const { handleCreateInvoice, deleteMutation, isCreating } = useInvoiceOperations();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const data = await businessQueries.getInvoices();
      return data.map(invoice => ({
        ...invoice,
        date: new Date(invoice.date).toISOString(),
        dueDate: new Date(invoice.dueDate).toISOString()
      }));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const isPending = handleCreateInvoice(formData);
    if (!isPending) {
      setIsDialogOpen(false);
    }
  };

  if (isLoading) return <div>{t("common:common.loading")}</div>;

  return (
    <div className="space-y-4">
      <InvoiceToolbar 
        onCreateClick={() => {
          setEditingInvoice(null);
          setIsDialogOpen(true);
        }}
        onImportClick={() => setIsImportDialogOpen(true)}
      />

      <InvoiceTable 
        invoices={invoices}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

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