import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Invoice, InvoiceItem } from "@/types/business";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceParties from "./InvoiceParties";
import InvoiceItems from "./InvoiceItems";
import InvoiceFooter from "./InvoiceFooter";

interface InvoiceFormProps {
  editingInvoice: Invoice | null;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const InvoiceForm = ({
  editingInvoice,
  onSubmit,
  isLoading,
  onCancel
}: InvoiceFormProps) => {
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

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: businessQueries.getClients,
  });

  const { data: providers = [] } = useQuery({
    queryKey: ['providers'],
    queryFn: businessQueries.getProviders,
  });

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = items.reduce((sum, item) => sum + (item.total * item.vatRate / 100), 0);
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append('items', JSON.stringify(items));
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmitForm} className="space-y-6">
      <InvoiceHeader
        formData={formData}
        onChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
      />
      
      <InvoiceParties
        formData={formData}
        clients={clients}
        providers={providers}
        onChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
      />
      
      <InvoiceItems
        items={items}
        onItemsChange={setItems}
        currency={formData.currency}
      />
      
      <InvoiceFooter
        formData={formData}
        totals={calculateTotals()}
        onChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="px-6"
        >
          {t("common:actions.cancel")}
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="px-6"
        >
          {editingInvoice ? t("common:actions.update") : t("common:actions.create")}
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;