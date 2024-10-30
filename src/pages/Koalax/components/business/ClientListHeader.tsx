import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ClientListHeaderProps {
  onAddClick: () => void;
}

const ClientListHeader = ({ onAddClick }: ClientListHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Clients</h2>
      <Button onClick={onAddClick}>
        <Plus className="w-4 h-4 mr-2" />
        Add Client
      </Button>
    </div>
  );
};

export default ClientListHeader;