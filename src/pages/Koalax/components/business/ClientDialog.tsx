import { Client } from "@/types/business";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ValidatedInput from "@/components/form/ValidatedInput";

interface ClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingClient: Client | null;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const ClientDialog = ({
  isOpen,
  onOpenChange,
  editingClient,
  onSubmit,
  isLoading,
}: ClientDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingClient ? "Edit Client" : "Add New Client"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <ValidatedInput
            id="name"
            name="name"
            label="Name"
            value={editingClient?.name || ""}
            onChange={() => {}}
            required
          />
          <ValidatedInput
            id="email"
            name="email"
            label="Email"
            type="email"
            value={editingClient?.email || ""}
            onChange={() => {}}
            required
          />
          <ValidatedInput
            id="phone"
            name="phone"
            label="Phone"
            value={editingClient?.phone || ""}
            onChange={() => {}}
          />
          <ValidatedInput
            id="company"
            name="company"
            label="Company"
            value={editingClient?.company || ""}
            onChange={() => {}}
          />
          <ValidatedInput
            id="vatNumber"
            name="vatNumber"
            label="VAT Number"
            value={editingClient?.vatNumber || ""}
            onChange={() => {}}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {editingClient ? "Update" : "Add"} Client
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDialog;