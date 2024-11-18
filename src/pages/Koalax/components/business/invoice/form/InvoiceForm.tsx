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
import { useToast } from "@/components/ui/use-toast";

interface InvoiceFormProps {
  editingInvoice: Invoice | null;
  onSubmit: (formData: FormData) => void;
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
    const subtotal = items.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return sum + (quantity * unitPrice);
    }, 0);
    
    const tax = items.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const vatRate = Number(item.vatRate) || 0;
      return sum + ((quantity * unitPrice) * vatRate / 100);
    }, 0);

    return {
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number((subtotal + tax).toFixed(2))
    };
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

    const formDataObj = new FormData();
    
    // Add all form data fields
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    // Process items with proper number formatting
    const processedItems = items.map(item => ({
      id: item.id,
      sku: item.sku || '',
      description: item.description,
      quantity: Number(item.quantity) || 0,
      unitPrice: Number(item.unitPrice) || 0,
      vatRate: Number(item.vatRate) || 0,
      unit: item.unit || 'unit',
      total: Number((Number(item.quantity) * Number(item.unitPrice)).toFixed(2))
    }));

    // Add items as a stringified JSON array
    formDataObj.append('items', JSON.stringify(processedItems));

    const totals = calculateTotals();
    formDataObj.append('totalAmount', totals.total.toString());
    formDataObj.append('tax', totals.tax.toString());
    
    try {
      await onSubmit(formDataObj);
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
    <form onSubmit={handleSubmitForm} className="max-w-5xl mx-auto">
      <div className="space-y-8 bg-white dark:bg-gray-950 p-8 rounded-lg shadow-sm border">
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

        <div className="flex justify-end gap-4 pt-8 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="min-w-[120px]"
          >
            {t("common:actions.cancel")}
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
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
      </div>
    </form>
  );
};

export default InvoiceForm;