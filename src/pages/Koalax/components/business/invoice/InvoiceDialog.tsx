import { Invoice, InvoiceItem } from "@/types/business";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { useTranslation } from "react-i18next";
import InvoiceItemsList from "./InvoiceItemsList";
import InvoiceFormSelects from "./InvoiceFormSelects";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

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
    number: editingInvoice?.number || `INV-${Date.now()}`,
    date: editingInvoice?.date || format(new Date(), 'yyyy-MM-dd'),
    dueDate: editingInvoice?.dueDate || format(new Date(Date.now() + 30*24*60*60*1000), 'yyyy-MM-dd'),
    status: editingInvoice?.status || 'draft',
    paymentTerms: editingInvoice?.paymentTerms || 'net30',
    currency: editingInvoice?.currency || 'EUR'
  });

  useEffect(() => {
    if (editingInvoice) {
      setFormData({
        clientId: editingInvoice.clientId,
        providerId: editingInvoice.providerId,
        notes: editingInvoice.notes,
        number: editingInvoice.number,
        date: format(new Date(editingInvoice.date), 'yyyy-MM-dd'),
        dueDate: format(new Date(editingInvoice.dueDate), 'yyyy-MM-dd'),
        status: editingInvoice.status,
        paymentTerms: editingInvoice.paymentTerms || 'net30',
        currency: editingInvoice.currency || 'EUR'
      });
      setItems(editingInvoice.items);
    }
  }, [editingInvoice]);

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

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = items.reduce((sum, item) => sum + (item.total * item.vatRate / 100), 0);
    return { subtotal, tax, total: subtotal + tax };
  };

  const { subtotal, tax, total } = calculateTotals();

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append('items', JSON.stringify(items));
    onSubmit(e);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingInvoice ? t("admin:business.invoices.edit") : t("admin:business.invoices.add")}
          </DialogTitle>
          <DialogDescription>
            {editingInvoice 
              ? t("admin:business.invoices.editDescription") 
              : t("admin:business.invoices.addDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmitForm} className="space-y-6">
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("admin:business.invoices.number")}</label>
                <Input
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("admin:business.invoices.date")}</label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("admin:business.invoices.dueDate")}</label>
                <Input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <InvoiceFormSelects
              clientId={formData.clientId}
              providerId={formData.providerId}
              clients={clients}
              providers={providers}
              onSelectChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
            />
          </Card>

          <Card className="p-4">
            <InvoiceItemsList
              items={items}
              onAddItem={() => setItems([...items, {
                id: crypto.randomUUID(),
                description: "",
                quantity: 1,
                unitPrice: 0,
                total: 0,
                vatRate: 21,
                sku: "",
                unit: "unit"
              }])}
              onRemoveItem={(id) => setItems(items.filter(item => item.id !== id))}
              onUpdateItem={(id, field, value) => {
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
              }}
            />
          </Card>

          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("admin:business.invoices.notes")}</label>
                <Textarea
                  name="notes"
                  placeholder={t("admin:business.invoices.notesPlaceholder")}
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Subtotal:</span>
                  <span>{subtotal.toFixed(2)} {formData.currency}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Tax ({items[0]?.vatRate || 21}%):</span>
                  <span>{tax.toFixed(2)} {formData.currency}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>{total.toFixed(2)} {formData.currency}</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              {t("common:actions.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {editingInvoice ? t("common:actions.update") : t("common:actions.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;