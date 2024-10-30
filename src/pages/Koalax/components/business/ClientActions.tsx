import { Client } from "@/types/business";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ClientActionsProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export const ClientActions = ({ client, onEdit, onDelete }: ClientActionsProps) => {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(client)}
      >
        <Pencil className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(client)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </>
  );
};