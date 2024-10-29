import { Email } from "@/hooks/useEmails";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EmailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingEmail: Email | null;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const EmailDialog = ({
  isOpen,
  onOpenChange,
  editingEmail,
  onSubmit,
  isLoading,
}: EmailDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingEmail ? "Edit Email" : "Add New Email"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              name="name"
              defaultValue={editingEmail?.data.name}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              name="email"
              type="email"
              defaultValue={editingEmail?.data.email}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Input
              name="type"
              defaultValue={editingEmail?.data.type}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              name="password"
              type="password"
              placeholder={editingEmail ? "Leave blank to keep current password" : "Enter password"}
              minLength={6}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {editingEmail ? "Update" : "Add"} Email
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;