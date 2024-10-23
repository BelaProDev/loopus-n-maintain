import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { faunaQueries } from "@/lib/fauna";
import { useToast } from "@/components/ui/use-toast";

export interface Service {
  ref: {
    id: string;
  };
  data: {
    type: string;
    description: string;
    status: 'active' | 'completed' | 'pending';
  };
}

export function useServices() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const servicesQuery = useQuery({
    queryKey: ['services'],
    queryFn: faunaQueries.getAllServices,
  });

  const createServiceMutation = useMutation({
    mutationFn: faunaQueries.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Success",
        description: "Service request created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create service request",
        variant: "destructive",
      });
    },
  });

  return {
    services: servicesQuery.data as Service[] | undefined,
    isLoading: servicesQuery.isLoading,
    error: servicesQuery.error,
    createService: createServiceMutation.mutate,
    isCreating: createServiceMutation.isPending,
  };
}