import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Invoice, InvoiceItem } from "@/types/invoice";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceParties from "./InvoiceParties";
import InvoiceItems from "./InvoiceItems";
import InvoiceFooter from "./InvoiceFooter";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
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
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = items.reduce((sum, item) => sum + ((item.quantity * item.unitPrice) * item.vatRate / 100), 0);
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId || !formData.providerId) {
      toast({
        title: t("common:common.error"),
        description: t("admin:business.invoices.missingParties"),
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: t("common:common.error"),
        description: t("admin:business.invoices.noItems"),
        variant: "destructive"
      });
      return;
    }

    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    const totals = calculateTotals();
    
    // Ensure items are properly serialized with their complete data
    const serializedItems = items.map(item => ({
      id: item.id,
      sku: item.sku || '',
      description: item.description || '',
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      unit: item.unit || 'unit',
      vatRate: Number(item.vatRate),
      total: Number(item.quantity) * Number(item.unitPrice)
    }));

    formDataObj.append('items', JSON.stringify(serializedItems));
    formDataObj.append('totalAmount', totals.total.toString());
    formDataObj.append('tax', totals.tax.toString());
    formDataObj.append('status', formData.status);
    formDataObj.append('currency', formData.currency);
    formDataObj.append('paymentTerms', formData.paymentTerms);
    
    try {
      await onSubmit(e);
      toast({
        title: t("common:common.success"),
        description: editingInvoice 
          ? t("admin:business.invoices.updateSuccess")
          : t("admin:business.invoices.createSuccess")
      });
    } catch (error) {
      console.error('Error submitting invoice:', error);
      toast({
        title: t("common:common.error"),
        description: t("admin:business.invoices.submitError"),
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmitForm} className="space-y-8 max-w-7xl mx-auto">
      <Card className="p-8 space-y-8 shadow-lg">
        <div className="space-y-8">
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
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            size="lg"
            className="min-w-[120px]"
          >
            {t("common:actions.cancel")}
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            size="lg"
            className="min-w-[120px]"
          >
            {isLoading ? (
              <span>{t("common:common.loading")}</span>
            ) : (
              <span>
                {editingInvoice ? t("common:actions.update") : t("common:actions.create")}
              </span>
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default InvoiceForm;