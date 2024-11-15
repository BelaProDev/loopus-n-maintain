import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { invoiceService } from "@/services/invoiceService";
import type { CreateInvoiceDTO } from "@/types/invoice";

export const useInvoiceOperations = () => {
  const { toast } = useToast();
  const { t } = useTranslation(["admin", "common"]);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (dto: CreateInvoiceDTO) => {
      // Ensure dates are properly formatted
      const formattedDto = {
        ...dto,
        date: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      return invoiceService.createInvoice(formattedDto);
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
    mutationFn: invoiceService.deleteInvoice,
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

  const handleCreateInvoice = async (formData: FormData): Promise<void> => {
    const dto: CreateInvoiceDTO = {
      clientId: formData.get("clientId") as string,
      providerId: formData.get("providerId") as string,
      notes: formData.get("notes") as string,
      items: JSON.parse(formData.get("items") as string) || []
    };

    await createMutation.mutateAsync(dto);
  };

  return {
    handleCreateInvoice,
    deleteMutation,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};