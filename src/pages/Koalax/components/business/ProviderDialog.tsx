import { Provider } from "@/types/business";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ValidatedInput from "@/components/form/ValidatedInput";

interface ProviderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProvider: Provider | null;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const ProviderDialog = ({
  isOpen,
  onOpenChange,
  editingProvider,
  onSubmit,
  isLoading,
}: ProviderDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingProvider ? "Edit Provider" : "Add New Provider"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <ValidatedInput
            id="name"
            name="name"
            label="Name"
            value={editingProvider?.name || ""}
            onChange={() => {}}
            required
          />
          <ValidatedInput
            id="email"
            name="email"
            label="Email"
            type="email"
            value={editingProvider?.email || ""}
            onChange={() => {}}
            required
          />
          <ValidatedInput
            id="phone"
            name="phone"
            label="Phone"
            value={editingProvider?.phone || ""}
            onChange={() => {}}
            required
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Service</label>
            <Select
              name="service"
              defaultValue={editingProvider?.service}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electrics">Electrics</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="ironwork">Ironwork</SelectItem>
                <SelectItem value="woodwork">Woodwork</SelectItem>
                <SelectItem value="architecture">Architecture</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {editingProvider ? "Update" : "Add"} Provider
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderDialog;