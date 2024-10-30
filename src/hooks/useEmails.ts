import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { emailQueries } from "@/lib/mongodb/emailQueries";
import { useToast } from "@/components/ui/use-toast";

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
  const queryClient = useQueryClient();

  const emailsQuery = useQuery({
    queryKey: ['emails'],
    queryFn: emailQueries.getAllEmails,
  });

  const updateEmailMutation = useMutation({
    mutationFn: (email: Email) => emailQueries.updateEmail(email.ref.id, email.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast({ title: "Success", description: "Email updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update email", variant: "destructive" });
    },
  });

  const deleteEmailMutation = useMutation({
    mutationFn: emailQueries.deleteEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast({ title: "Success", description: "Email deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete email", variant: "destructive" });
    },
  });

  return {
    emails: emailsQuery.data as Email[] | undefined,
    isLoading: emailsQuery.isLoading,
    error: emailsQuery.error,
    updateEmail: updateEmailMutation.mutate,
    deleteEmail: deleteEmailMutation.mutate,
    isDeleting: deleteEmailMutation.isPending,
  };
}