import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import InvoiceDialog from "./invoice/InvoiceDialog";
import ImportInvoiceDialog from "./invoice/ImportInvoiceDialog";
import { useTranslation } from "react-i18next";
import { useInvoiceOperations } from "@/hooks/useInvoiceOperations";
import InvoiceTable from "./invoice/InvoiceTable";
import InvoiceToolbar from "./invoice/InvoiceToolbar";
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
      return response;
    },
    retry: 1,
    staleTime: 30000, // Cache data for 30 seconds
    refetchOnWindowFocus: false
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
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-600">
          {t("admin:business.invoices.fetchError")}
        </div>
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