import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import type { Invoice } from "@/types/invoice";

export const useInvoiceList = () => {
  const { toast } = useToast();
  const { t } = useTranslation(["admin", "common"]);

  const { 
    data: invoices = [], 
    isLoading,
    error 
  } = useQuery<Invoice[], Error>({
    queryKey: ['invoices'],
    queryFn: businessQueries.getInvoices,
    meta: {
      onError: () => {
        toast({
          title: t("common:status.error"),
          description: t("admin:business.invoices.loadError"),
          variant: "destructive"
        });
      }
    }
  });

  return {
    invoices,
    isLoading,
    error
  };
};