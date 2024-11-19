import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import InvoiceForm from "./form/InvoiceForm";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { useInvoiceOperations } from "@/hooks/useInvoiceOperations";
import { useToast } from "@/components/ui/use-toast";

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
    return <div className="p-8 text-center">{t("common:status.loading")}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b px-6 py-4 flex items-center justify-between bg-white shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">
          {invoiceId ? t("admin:business.invoices.edit") : t("admin:business.invoices.add")}
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/business/invoices")}
          className="rounded-full hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-gray-600" />
        </Button>
      </div>

      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 animate-fade-in">
            <InvoiceForm
              editingInvoice={invoice || null}
              onSubmit={handleSubmit}
              isLoading={isCreating || isUpdating}
              onCancel={() => navigate("/admin/business/invoices")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;