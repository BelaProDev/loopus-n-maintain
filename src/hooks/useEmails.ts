import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { emailQueries } from "@/lib/fauna/emailQueries";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

export interface Email {
  ref: { id: string };
  data: {
    email: string;
    name: string;
    type: string;
  };
}

export function useEmails() {
  const { toast } = useToast();
  const { t } = useTranslation(["admin", "common"]);
  const queryClient = useQueryClient();

  const emailsQuery = useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      const result = await emailQueries.getAllEmails();
      return result;
    },
  });

  const createEmailMutation = useMutation({
    mutationFn: async (data: any) => {
      const result = await emailQueries.createEmail(data);
      if (!result) throw new Error('Failed to create email');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast({ 
        title: t("common:common.success"), 
        description: t("admin:email.addSuccess") 
      });
    },
    onError: () => {
      toast({ 
        title: t("common:common.error"), 
        description: t("admin:email.addError"), 
        variant: "destructive" 
      });
    },
  });

  const updateEmailMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Email['data'] }) => {
      const result = await emailQueries.updateEmail(id, data);
      if (!result) throw new Error('Failed to update email');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast({ 
        title: t("common:common.success"), 
        description: t("admin:email.updateSuccess") 
      });
    },
    onError: () => {
      toast({ 
        title: t("common:common.error"), 
        description: t("admin:email.updateError"), 
        variant: "destructive" 
      });
    },
  });

  const deleteEmailMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await emailQueries.deleteEmail(id);
      if (!result) throw new Error('Failed to delete email');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast({ 
        title: t("common:common.success"), 
        description: t("admin:email.deleteSuccess") 
      });
    },
    onError: () => {
      toast({ 
        title: t("common:common.error"), 
        description: t("admin:email.deleteError"), 
        variant: "destructive" 
      });
    },
  });

  return {
    emails: emailsQuery.data as Email[] | undefined,
    isLoading: emailsQuery.isLoading,
    error: emailsQuery.error,
    createEmail: createEmailMutation.mutate,
    updateEmail: updateEmailMutation.mutate,
    deleteEmail: deleteEmailMutation.mutate,
    isCreating: createEmailMutation.isPending,
    isUpdating: updateEmailMutation.isPending,
    isDeleting: deleteEmailMutation.isPending,
  };
}