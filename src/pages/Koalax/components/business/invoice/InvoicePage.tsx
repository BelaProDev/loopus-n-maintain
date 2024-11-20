import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { useInvoiceOperations } from "@/hooks/useInvoiceOperations";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import InvoiceForm from "./form/InvoiceForm";
import { Loader2 } from "lucide-react";

const InvoicePage = () => {
  const { t } = useTranslation(["admin", "common"]);
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const { toast } = useToast();
  const { handleCreateInvoice, handleUpdateInvoice, isCreating, isUpdating } = useInvoiceOperations();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoices', invoiceId],
    queryFn: () => invoiceId ? businessQueries.getInvoiceById(invoiceId) : null,
    enabled: !!invoiceId
  });

  const handleSubmit = async (formData: FormData) => {
    try {
      if (invoiceId) {
        await handleUpdateInvoice(invoiceId, formData);
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
      navigate("/admin/business/invoices");
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
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-background">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            {invoiceId ? t("admin:business.invoices.edit") : t("admin:business.invoices.create")}
          </h1>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6">
          <InvoiceForm
            editingInvoice={invoice || null}
            onSubmit={handleSubmit}
            isLoading={isCreating || isUpdating}
            onCancel={() => navigate("/admin/business/invoices")}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;