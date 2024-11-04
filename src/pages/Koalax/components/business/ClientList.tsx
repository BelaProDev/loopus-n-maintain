import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Client } from "@/types/business";
import ClientDialog from "./ClientDialog";
import { useToast } from "@/components/ui/use-toast";

const ClientList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: businessQueries.getClients
  });

  const createMutation = useMutation({
    mutationFn: (clientData: Omit<Client, 'id' | 'totalInvoices' | 'totalAmount' | 'status'>) => 
      businessQueries.createClient(clientData),
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
    };

    createMutation.mutate(clientData);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clients</h2>
        <Button onClick={() => {
          setEditingClient(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients?.map((client: Client) => (
            <TableRow key={client.id}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.company}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingClient(client);
                    setIsDialogOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement delete functionality
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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