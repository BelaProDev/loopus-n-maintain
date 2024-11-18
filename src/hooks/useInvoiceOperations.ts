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
    mutationFn: (dto: CreateInvoiceDTO) => invoiceService.createInvoice(dto),
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

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CreateInvoiceDTO }) => {
      return invoiceService.updateInvoice(id, dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({ 
        title: t("common:common.success"), 
        description: t("admin:business.invoices.updateSuccess") 
      });
    },
    onError: (error) => {
      console.error('Update invoice error:', error);
      toast({ 
        title: t("common:common.error"), 
        description: t("admin:business.invoices.updateError"), 
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

  const parseInvoiceItems = (itemsString: string) => {
    try {
      const items = JSON.parse(itemsString);
      if (!Array.isArray(items)) {
        throw new Error('Items must be an array');
      }
      return items.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        vatRate: Number(item.vatRate),
        total: Number(item.total)
      }));
    } catch (error) {
      console.error('Error parsing invoice items:', error);
      return [];
    }
  };

  const handleCreateInvoice = async (formData: FormData) => {
    const items = parseInvoiceItems(formData.get("items") as string);
    
    const dto: CreateInvoiceDTO = {
      clientId: formData.get("clientId") as string,
      providerId: formData.get("providerId") as string,
      notes: formData.get("notes") as string,
      items,
      paymentTerms: formData.get("paymentTerms") as string,
      currency: formData.get("currency") as string
    };

    await createMutation.mutateAsync(dto);
  };

  const handleUpdateInvoice = async (id: string, formData: FormData) => {
    const items = parseInvoiceItems(formData.get("items") as string);
    
    const dto: CreateInvoiceDTO = {
      clientId: formData.get("clientId") as string,
      providerId: formData.get("providerId") as string,
      notes: formData.get("notes") as string,
      items,
      paymentTerms: formData.get("paymentTerms") as string,
      currency: formData.get("currency") as string
    };

    await updateMutation.mutateAsync({ id, dto });
  };

  return {
    handleCreateInvoice,
    handleUpdateInvoice,
    deleteMutation,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};