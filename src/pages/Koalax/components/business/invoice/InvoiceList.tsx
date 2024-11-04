import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Invoice } from "@/types/business";
import InvoiceDialog from "../InvoiceDialog";
import InvoiceActions from "./InvoiceActions";
import InvoiceStatus from "./InvoiceStatus";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { exportToPDF, exportToDOCX } from "@/lib/documentExport";
import { uploadFile } from "@/lib/dropbox";
import { useTranslation } from "react-i18next";

const InvoiceList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation(["admin", "common"]);

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: businessQueries.getInvoices
  });

  const createMutation = useMutation({
    mutationFn: businessQueries.createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({ 
        title: t("common:common.success"), 
        description: t("admin:business.invoices.addSuccess") 
      });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ 
        title: t("common:common.error"), 
        description: t("admin:business.invoices.addError"), 
        variant: "destructive" 
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const invoiceData = {
      clientId: formData.get("clientId") as string,
      providerId: formData.get("providerId") as string,
      notes: formData.get("notes") as string,
      number: `INV-${Date.now()}`,
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "draft" as const,
      items: [],
      totalAmount: 0,
      tax: 0
    };

    createMutation.mutate(invoiceData);
  };

  const handleExport = async (invoice: Invoice, type: 'pdf' | 'docx') => {
    try {
      let blob: Blob;
      
      if (type === 'pdf') {
        blob = await exportToPDF(invoice) as Blob;
      } else {
        blob = await exportToDOCX(invoice);
      }

      const tokens = JSON.parse(sessionStorage.getItem('dropbox_tokens') || '{}');
      if (tokens.access_token) {
        try {
          await uploadFile(blob, '/invoices', `${invoice.number}.${type}`);
          toast({
            title: t("common:common.success"),
            description: t("admin:business.invoices.exportSuccess", { type: type.toUpperCase() }),
          });
        } catch (error) {
          toast({
            title: t("common:common.warning"),
            description: t("admin:business.invoices.exportDropboxError"),
            variant: "destructive",
          });
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.number}.${type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      toast({
        title: t("common:common.error"),
        description: t("admin:business.invoices.exportError", { type: type.toUpperCase() }),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await businessQueries.deleteInvoice(id);
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({ 
        title: t("common:common.success"), 
        description: t("admin:business.invoices.deleteSuccess") 
      });
    } catch (error) {
      toast({ 
        title: t("common:common.error"), 
        description: t("admin:business.invoices.deleteError"), 
        variant: "destructive" 
      });
    }
  };

  if (isLoading) return <div>{t("common:common.loading")}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("admin:business.invoices.title")}</h2>
        <Button onClick={() => {
          setEditingInvoice(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          {t("admin:business.invoices.add")}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("admin:business.invoices.number")}</TableHead>
            <TableHead>{t("admin:business.invoices.date")}</TableHead>
            <TableHead>{t("admin:business.invoices.dueDate")}</TableHead>
            <TableHead>{t("admin:business.invoices.amount")}</TableHead>
            <TableHead>{t("admin:business.invoices.status")}</TableHead>
            <TableHead className="text-right">{t("common:common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.map((invoice: Invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.number}</TableCell>
              <TableCell>{format(new Date(invoice.date), 'PPP')}</TableCell>
              <TableCell>{format(new Date(invoice.dueDate), 'PPP')}</TableCell>
              <TableCell>€{invoice.totalAmount.toFixed(2)}</TableCell>
              <TableCell>
                <InvoiceStatus status={invoice.status} />
              </TableCell>
              <TableCell className="text-right">
                <InvoiceActions
                  invoice={invoice}
                  onExport={handleExport}
                  onDelete={handleDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <InvoiceDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingInvoice={editingInvoice}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
};

export default InvoiceList;