import { Invoice, InvoiceItem } from "@/types/invoice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { useTranslation } from "react-i18next";
import InvoiceItemsList from "./invoice/InvoiceItemsList";
import InvoiceFormSelects from "./invoice/InvoiceFormSelects";

interface InvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingInvoice: Invoice | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

const InvoiceDialog = ({
  isOpen,
  onOpenChange,
  editingInvoice,
  onSubmit,
  isLoading,
}: InvoiceDialogProps) => {
  const { t } = useTranslation(["admin", "common"]);
  const [items, setItems] = useState<InvoiceItem[]>(editingInvoice?.items || []);
  const [formData, setFormData] = useState({
    clientId: editingInvoice?.clientId || "",
    providerId: editingInvoice?.providerId || "",
    notes: editingInvoice?.notes || "",
  });
  
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: businessQueries.getClients,
  });

  const { data: providers = [] } = useQuery({
    queryKey: ['providers'],
    queryFn: businessQueries.getProviders,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append('items', JSON.stringify(items));
    await onSubmit(e);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingInvoice ? t("admin:invoices.edit") : t("admin:invoices.create")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <InvoiceFormSelects
            clientId={formData.clientId}
            providerId={formData.providerId}
            clients={clients}
            providers={providers}
            onSelectChange={handleSelectChange}
          />

          <InvoiceItemsList
            items={items}
            onAddItem={() => setItems([...items, {
              id: crypto.randomUUID(),
              sku: '',
              description: '',
              quantity: 1,
              unitPrice: 0,
              total: 0,
              vatRate: 21,
              unit: 'unit'
            }])}
            onRemoveItem={(id) => setItems(items.filter(item => item.id !== id))}
            onUpdateItem={(id, field, value) => setItems(items.map(item => 
              item.id === id ? { ...item, [field]: value } : item
            ))}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("admin:invoices.notes")}</label>
            <Input
              name="notes"
              placeholder={t("admin:invoices.notesPlaceholder")}
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {editingInvoice ? t("common:actions.update") : t("common:actions.create")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;