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

  if (isLoading) return <div className="text-gray-700">{t("common:common.loading")}</div>;

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
              <TableHead className="text-gray-900">{t("admin:business.clients.name")}</TableHead>
              <TableHead className="text-gray-900">{t("admin:business.clients.email")}</TableHead>
              <TableHead className="text-gray-900">{t("admin:business.clients.company")}</TableHead>
              <TableHead className="text-right text-gray-900">{t("common:common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client: Client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium text-gray-900">{client.name}</TableCell>
                <TableCell className="text-gray-700">{client.email}</TableCell>
                <TableCell className="text-gray-700">{client.company}</TableCell>
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
          setIsDialogOpen(false);
        }}
        isLoading={false}
      />
    </div>
  );
};

export default ClientList;