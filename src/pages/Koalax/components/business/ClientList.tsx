import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Client } from "@/types/business";
import ClientDialog from "./ClientDialog";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const ClientList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation(["admin", "common"]);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: businessQueries.getClients
  });

  if (isLoading) return <div>{t("common:common.loading")}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setEditingClient(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("admin:business.clients.add")}
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin:business.clients.name")}</TableHead>
              <TableHead>{t("admin:business.clients.email")}</TableHead>
              <TableHead>{t("admin:business.clients.company")}</TableHead>
              <TableHead className="text-right">{t("common:common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client: Client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
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
                      // TODO: Implement delete
                      toast({
                        title: t("common:common.success"),
                        description: t("admin:business.clients.deleteSuccess")
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ClientDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingClient={editingClient}
        onSubmit={() => {
          // TODO: Implement submit
          setIsDialogOpen(false);
        }}
        isLoading={false}
      />
    </div>
  );
};

export default ClientList;