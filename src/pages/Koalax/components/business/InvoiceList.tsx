import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { businessQueries } from "@/lib/mongodb/businessQueries";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Invoice } from "@/types/business";
import InvoiceDialog from "./InvoiceDialog";
import { useToast } from "@/components/ui/use-toast";
import { exportToPDF } from "@/lib/documentExport";

const InvoiceList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: businessQueries.getInvoices
  });

  const createMutation = useMutation({
    mutationFn: businessQueries.createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({ title: "Success", description: "Invoice created successfully" });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to create invoice", 
        variant: "destructive" 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: businessQueries.deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({ title: "Success", description: "Invoice deleted successfully" });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to delete invoice", 
        variant: "destructive" 
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const invoiceData = {
      number: `INV-${Date.now()}`,
      clientId: formData.get("clientId") as string,
      providerId: formData.get("providerId") as string,
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      items: JSON.parse(formData.get("items") as string || "[]"),
      totalAmount: Number(formData.get("totalAmount")) || 0,
      tax: Number(formData.get("tax")) || 0,
      status: "draft" as const,
      notes: formData.get("notes") as string,
    };

    createMutation.mutate(invoiceData);
  };

  const handleExport = async (invoice: Invoice) => {
    try {
      const blob = await exportToPDF(invoice);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoice.number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export invoice",
        variant: "destructive"
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Invoices</h2>
        <Button onClick={() => {
          setEditingInvoice(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.map((invoice: Invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.number}</TableCell>
              <TableCell>{invoice.clientId}</TableCell>
              <TableCell>{invoice.providerId}</TableCell>
              <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
              <TableCell>${invoice.totalAmount.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingInvoice(invoice);
                    setIsDialogOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(invoice.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExport(invoice)}
                >
                  Export
                </Button>
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
