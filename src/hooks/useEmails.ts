import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { faunaQueries } from "@/lib/fauna";
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
    queryFn: faunaQueries.getAllEmails,
  });

  const createEmailMutation = useMutation({
    mutationFn: faunaQueries.createEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast({ title: "Success", description: "Email added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add email", variant: "destructive" });
    },
  });

  const updateEmailMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Email['data'] }) => 
      faunaQueries.updateEmail(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast({ title: "Success", description: "Email updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update email", variant: "destructive" });
    },
  });

  const deleteEmailMutation = useMutation({
    mutationFn: faunaQueries.deleteEmail,
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
    createEmail: createEmailMutation.mutate,
    updateEmail: updateEmailMutation.mutate,
    deleteEmail: deleteEmailMutation.mutate,
    isCreating: createEmailMutation.isPending,
    isUpdating: updateEmailMutation.isPending,
    isDeleting: deleteEmailMutation.isPending,
  };
}