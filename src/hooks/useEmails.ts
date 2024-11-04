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
    queryFn: () => Promise.resolve(faunaQueries.getAllEmails()),
  });

  const createEmailMutation = useMutation({
    mutationFn: (data: any) => Promise.resolve(faunaQueries.createEmail(data)),
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
      Promise.resolve(faunaQueries.updateEmail(id, data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast({ title: "Success", description: "Email updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update email", variant: "destructive" });
    },
  });

  const deleteEmailMutation = useMutation({
    mutationFn: (id: string) => Promise.resolve(faunaQueries.deleteEmail(id)),
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