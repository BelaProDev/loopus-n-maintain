import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { parseInvoiceCSV } from "@/lib/csvParser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";

interface ImportInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportInvoiceDialog = ({ isOpen, onOpenChange }: ImportInvoiceDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: businessQueries.createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({ 
        title: "Success", 
        description: "Invoice imported successfully" 
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to import invoice", 
        variant: "destructive" 
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      toast({
        title: "Error",
        description: "Please select a valid CSV file",
        variant: "destructive"
      });
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      const text = await file.text();
      const invoiceData = parseInvoiceCSV(text);
      
      if (!invoiceData.clientId || !invoiceData.providerId) {
        toast({
          title: "Error",
          description: "Please select a client and provider for the invoice",
          variant: "destructive"
        });
        return;
      }

      importMutation.mutate(invoiceData as any);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse CSV file",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Invoice from CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <Button 
            onClick={handleImport} 
            disabled={!file || importMutation.isPending}
            className="w-full"
          >
            Import Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportInvoiceDialog;