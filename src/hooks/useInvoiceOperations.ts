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
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CreateInvoiceDTO }) => {
      return invoiceService.updateInvoice(id, dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: invoiceService.deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    }
  });

  const handleCreateInvoice = async (formData: FormData) => {
    const dto = await prepareInvoiceDTO(formData);
    await createMutation.mutateAsync(dto);
  };

  const handleUpdateInvoice = async (id: string, formData: FormData) => {
    const dto = await prepareInvoiceDTO(formData);
    await updateMutation.mutateAsync({ id, dto });
  };

  const prepareInvoiceDTO = async (formData: FormData): Promise<CreateInvoiceDTO> => {
    const items = JSON.parse(formData.get("items") as string);
    
    return {
      clientId: formData.get("clientId") as string,
      providerId: formData.get("providerId") as string,
      notes: formData.get("notes") as string,
      items,
      paymentTerms: formData.get("paymentTerms") as string,
      currency: formData.get("currency") as string
    };
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