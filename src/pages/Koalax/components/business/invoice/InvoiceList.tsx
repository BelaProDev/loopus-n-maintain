import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { useTranslation } from "react-i18next";
import { useInvoiceOperations } from "@/hooks/useInvoiceOperations";
import InvoiceTable from "./InvoiceTable";
import InvoiceToolbar from "./InvoiceToolbar";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ImportInvoiceDialog from "@/components/business/invoice/ImportInvoiceDialog";

const InvoiceList = () => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const { t } = useTranslation(["admin", "common"]);
  const { deleteMutation } = useInvoiceOperations();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ['invoices'],
    queryFn: businessQueries.getInvoices
  });

  const handleCreateClick = () => {
    navigate("/admin/business/invoices/new");
  };

  const handleEditClick = (invoiceId: string) => {
    navigate(`/admin/business/invoices/${invoiceId}`);
  };

  const handleDeleteClick = async (invoiceId: string) => {
    try {
      await deleteMutation.mutateAsync(invoiceId);
      toast({
        title: t("common:status.success"),
        description: t("admin:business.invoices.deleteSuccess")
      });
    } catch (error) {
      toast({
        title: t("common:status.error"),
        description: t("admin:business.invoices.deleteError"),
        variant: "destructive"
      });
    }
  };

  if (error) {
    toast({
      title: t("common:status.error"),
      description: t("admin:business.invoices.fetchError"),
      variant: "destructive"
    });
  }

  return (
    <div className="space-y-4">
      <InvoiceToolbar 
        onCreateClick={handleCreateClick}
        onImportClick={() => setIsImportDialogOpen(true)}
      />

      {isLoading ? (
        <div className="text-center py-4">{t("common:common.loading")}</div>
      ) : (
        <InvoiceTable 
          invoices={invoices}
          onDelete={handleDeleteClick}
          onEdit={handleEditClick}
        />
      )}

      <ImportInvoiceDialog
        isOpen={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
      />
    </div>
  );
};

export default InvoiceList;