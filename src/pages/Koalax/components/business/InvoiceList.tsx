import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, FileText, Download, Trash2 } from "lucide-react";
import { Invoice } from "@/types/business";
import InvoiceDialog from "./InvoiceDialog";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { exportToPDF, exportToDOCX } from "@/lib/documentExport";
import { uploadFile } from "@/lib/dropbox";

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

  const handleExport = async (invoice: Invoice, type: 'pdf' | 'docx') => {
    try {
      let blob: Blob;
      
      if (type === 'pdf') {
        blob = await exportToPDF(invoice) as Blob;
      } else {
        blob = await exportToDOCX(invoice);
      }

      // Upload to Dropbox if authenticated
      const tokens = JSON.parse(sessionStorage.getItem('dropbox_tokens') || '{}');
      if (tokens.access_token) {
        try {
          await uploadFile(
            blob, 
            '/invoices', 
            `${invoice.number}.${type}`
          );
          toast({
            title: "Success",
            description: `Invoice exported and uploaded to Dropbox as ${type.toUpperCase()}`,
          });
        } catch (error) {
          console.error('Dropbox upload error:', error);
          toast({
            title: "Warning",
            description: `File saved locally but failed to upload to Dropbox`,
            variant: "destructive",
          });
        }
      }

      // Always provide local download as fallback
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
        title: "Error",
        description: `Failed to export invoice as ${type.toUpperCase()}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await businessQueries.deleteInvoice(id);
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({ title: "Success", description: "Invoice deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete invoice", variant: "destructive" });
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
            <TableHead>Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleExport(invoice, 'pdf')}
                >
                  PDF
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleExport(invoice, 'docx')}
                >
                  DOCX
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(invoice.id)}
                >
                  <Trash2 className="w-4 h-4" />
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
