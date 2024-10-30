import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fallbackDB } from "@/lib/fallback-db";
import { Client } from "@/types/business";
import { useToast } from "@/components/ui/use-toast";
import ClientDialog from "./ClientDialog";
import ClientListHeader from "./ClientListHeader";
import ClientTable from "./ClientTable";
import { dbSync } from "public/sw/db-sync";

const ClientList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => fallbackDB.find('clients')
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const result = await fallbackDB.insert('clients', data);
      await dbSync.addPendingChange({
        table: 'clients',
        operation: 'create',
        data
      });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({ title: "Success", description: "Client added successfully" });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to add client", 
        variant: "destructive" 
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const clientData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      vatNumber: formData.get("vatNumber") as string,
      type: 'client' as const
    };

    createMutation.mutate(clientData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ClientListHeader onAddClick={() => {
        setEditingClient(null);
        setIsDialogOpen(true);
      }} />

      <ClientTable
        clients={clients}
        onEdit={(client) => {
          setEditingClient(client);
          setIsDialogOpen(true);
        }}
        onDelete={() => {
          // TODO: Implement delete functionality
        }}
      />

      <ClientDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingClient={editingClient}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
};

export default ClientList;
