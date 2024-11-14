import { Client } from "@/types/business";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ValidatedInput from "@/components/form/ValidatedInput";
import { useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation(["admin", "common"]);
  const [formData, setFormData] = useState({
    name: editingClient?.name || "",
    email: editingClient?.email || "",
    phone: editingClient?.phone || "",
    company: editingClient?.company || "",
    vatNumber: editingClient?.vatNumber || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingClient ? t("admin:business.clients.edit") : t("admin:business.clients.add")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <ValidatedInput
            id="name"
            name="name"
            label={t("common:forms.name")}
            value={formData.name}
            onChange={handleChange}
            required
          />
          <ValidatedInput
            id="email"
            name="email"
            label={t("common:forms.email")}
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <ValidatedInput
            id="phone"
            name="phone"
            label={t("common:forms.phone")}
            value={formData.phone}
            onChange={handleChange}
          />
          <ValidatedInput
            id="company"
            name="company"
            label={t("common:forms.company")}
            value={formData.company}
            onChange={handleChange}
          />
          <ValidatedInput
            id="vatNumber"
            name="vatNumber"
            label={t("common:forms.vatNumber")}
            value={formData.vatNumber}
            onChange={handleChange}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {editingClient ? t("common:actions.update") : t("common:actions.add")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDialog;