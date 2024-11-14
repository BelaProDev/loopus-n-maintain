import { Invoice, InvoiceItem } from "@/types/business";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { useTranslation } from "react-i18next";

interface InvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingInvoice: Invoice | null;
  onSubmit: (e: React.FormEvent) => void;
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
  
  const { data: clientsResponse } = useQuery({
    queryKey: ['clients'],
    queryFn: businessQueries.getClients
  });

  const { data: providersResponse } = useQuery({
    queryKey: ['providers'],
    queryFn: businessQueries.getProviders
  });

  const clients = Array.isArray(clientsResponse) ? clientsResponse : clientsResponse?.data || [];
  const providers = Array.isArray(providersResponse) ? providersResponse : providersResponse?.data || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    setItems([...items, { 
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
      vatRate: 21
    }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append('items', JSON.stringify(items));
    onSubmit(e);
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("admin:invoices.client")}</label>
              <Select
                name="clientId"
                value={formData.clientId}
                onValueChange={(value) => handleSelectChange('clientId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin:invoices.selectClient")} />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map((client: any) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("admin:invoices.provider")}</label>
              <Select
                name="providerId"
                value={formData.providerId}
                onValueChange={(value) => handleSelectChange('providerId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin:invoices.selectProvider")} />
                </SelectTrigger>
                <SelectContent>
                  {providers?.map((provider: any) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t("admin:invoices.items")}</h3>
              <Button type="button" onClick={addItem} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                {t("admin:invoices.addItem")}
              </Button>
            </div>
            
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Input
                    placeholder={t("admin:invoices.description")}
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder={t("admin:invoices.quantity")}
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder={t("admin:invoices.price")}
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={item.total}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

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