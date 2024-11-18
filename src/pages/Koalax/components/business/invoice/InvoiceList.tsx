import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { useTranslation } from "react-i18next";
import { useInvoiceOperations } from "@/hooks/useInvoiceOperations";
import InvoiceTable from "./InvoiceTable";
import InvoiceToolbar from "./InvoiceToolbar";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import ImportInvoiceDialog from "@/components/business/invoice/ImportInvoiceDialog";
import { useState } from "react";

const InvoiceList = () => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const { t } = useTranslation(["admin", "common"]);
  const { deleteMutation } = useInvoiceOperations();
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
          onEdit={(invoice) => navigate(`/admin/business/invoices/${invoice.id}`)}
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