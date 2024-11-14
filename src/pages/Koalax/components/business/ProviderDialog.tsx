import { Provider } from "@/types/business";
import { Button } from "@/components/ui/button";
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
import { useTranslation } from "react-i18next";
import { useState } from "react";

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
  const { t } = useTranslation(["admin", "common", "services"]);
  const [formData, setFormData] = useState({
    name: editingProvider?.name || "",
    email: editingProvider?.email || "",
    phone: editingProvider?.phone || "",
    service: editingProvider?.service || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value: string) => {
    setFormData(prev => ({ ...prev, service: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingProvider ? t("admin:providers.edit") : t("admin:providers.add")}
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
            required
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("admin:providers.service")}</label>
            <Select
              name="service"
              value={formData.service}
              onValueChange={handleServiceChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={t("admin:providers.selectService")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electrics">{t("services:electrical.title")}</SelectItem>
                <SelectItem value="plumbing">{t("services:plumbing.title")}</SelectItem>
                <SelectItem value="ironwork">{t("services:ironwork.title")}</SelectItem>
                <SelectItem value="woodwork">{t("services:woodworking.title")}</SelectItem>
                <SelectItem value="architecture">{t("services:architecture.title")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {editingProvider ? t("common:actions.update") : t("common:actions.add")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderDialog;