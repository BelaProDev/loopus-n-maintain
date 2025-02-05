import { Email } from "@/hooks/useEmails";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { hashPassword } from "@/lib/auth/authUtils";

interface EmailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingEmail: Email | null;
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const EmailDialog = ({
  isOpen,
  onOpenChange,
  editingEmail,
  onSubmit,
  isLoading,
}: EmailDialogProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation(["admin", "common"]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!editingEmail || password) {
      if (password.length < 6) {
        toast({
          title: t("common:common.error"),
          description: t("admin:email.passwordTooShort"),
          variant: "destructive",
        });
        return;
      }
      
      if (password !== confirmPassword) {
        toast({
          title: t("common:common.error"),
          description: t("admin:email.passwordMismatch"),
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData(e.currentTarget);
      if (password) {
        formData.set('password', hashPassword(password));
      }
      
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="email-dialog-description">
        <DialogHeader>
          <DialogTitle>
            {editingEmail ? t("admin:email.edit") : t("admin:email.add")}
          </DialogTitle>
          <DialogDescription id="email-dialog-description">
            {editingEmail 
              ? t("admin:email.editDescription") 
              : t("admin:email.addDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin:email.name")}</label>
            <Input
              name="name"
              defaultValue={editingEmail?.data.name}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin:email.email")}</label>
            <Input
              name="email"
              type="email"
              defaultValue={editingEmail?.data.email}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin:email.type")}</label>
            <Input
              name="type"
              defaultValue={editingEmail?.data.type}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin:email.password")}</label>
            <Input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={editingEmail ? t("admin:email.passwordPlaceholderEdit") : t("admin:email.passwordPlaceholderNew")}
              minLength={6}
              required={!editingEmail}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin:email.confirmPassword")}</label>
            <Input
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("admin:email.confirmPasswordPlaceholder")}
              minLength={6}
              required={!editingEmail}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {editingEmail ? t("admin:email.update") : t("admin:email.add")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;