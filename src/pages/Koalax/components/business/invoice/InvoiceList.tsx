import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Upload } from "lucide-react";
import InvoiceDialog from "../InvoiceDialog";
import ImportInvoiceDialog from "@/components/business/invoice/ImportInvoiceDialog";
import InvoiceActions from "./InvoiceActions";
import InvoiceStatus from "./InvoiceStatus";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useInvoiceOperations } from "@/hooks/useInvoiceOperations";

const InvoiceList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const { t } = useTranslation(["admin", "common"]);
  const { handleCreateInvoice, deleteMutation, isCreating } = useInvoiceOperations();

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: businessQueries.getInvoices
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const isPending = handleCreateInvoice(formData);
    if (!isPending) {
      setIsDialogOpen(false);
    }
  };

  if (isLoading) return <div>{t("common:common.loading")}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("admin:business.invoices.title")}</h2>
        <div className="space-x-2">
          <Button onClick={() => setIsImportDialogOpen(true)} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button onClick={() => {
            setEditingInvoice(null);
            setIsDialogOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            {t("admin:business.invoices.add")}
          </Button>
        </div>
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
          {invoices?.map((invoice) => (
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
                  onDelete={(id) => deleteMutation.mutate(id)}
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
        isLoading={isCreating}
      />

      <ImportInvoiceDialog
        isOpen={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
      />
    </div>
  );
};

export default InvoiceList;