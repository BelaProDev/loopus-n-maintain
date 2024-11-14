import { useMutation, useQueryClient } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { Invoice } from "@/types/business";

export const useInvoiceOperations = () => {
  const { toast } = useToast();
  const { t } = useTranslation(["admin", "common"]);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Invoice, 'id'>) => {
      const result = await businessQueries.createInvoice(data);
      if (!result) throw new Error('Failed to create invoice');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({ 
        title: t("common:common.success"), 
        description: t("admin:business.invoices.addSuccess") 
      });
    },
    onError: (error) => {
      console.error('Create invoice error:', error);
      toast({ 
        title: t("common:common.error"), 
        description: t("admin:business.invoices.addError"), 
        variant: "destructive" 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await businessQueries.deleteInvoice(id);
      if (!result) throw new Error('Failed to delete invoice');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({ 
        title: t("common:common.success"), 
        description: t("admin:business.invoices.deleteSuccess") 
      });
    },
    onError: (error) => {
      console.error('Delete invoice error:', error);
      toast({ 
        title: t("common:common.error"), 
        description: t("admin:business.invoices.deleteError"), 
        variant: "destructive" 
      });
    }
  });

  const handleCreateInvoice = (formData: FormData) => {
    const invoiceData = {
      clientId: formData.get("clientId") as string,
      providerId: formData.get("providerId") as string,
      notes: formData.get("notes") as string,
      number: `INV-${Date.now()}`,
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "draft" as const,
      items: [],
      totalAmount: 0,
      tax: 0
    };

    createMutation.mutate(invoiceData);
    return createMutation.isPending;
  };

  return {
    handleCreateInvoice,
    deleteMutation,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};