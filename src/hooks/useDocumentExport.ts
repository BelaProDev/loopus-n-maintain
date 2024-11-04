import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Invoice } from "@/types/business";
import { exportToPDF, exportToDOCX } from "@/lib/documentExport";
import { uploadFile } from "@/lib/dropbox";

export const useDocumentExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (invoice: Invoice, type: 'pdf' | 'docx') => {
    setIsExporting(true);
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

      // Always provide local download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.number}.${type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error(`Export error:`, error);
      toast({
        title: "Error",
        description: `Failed to export invoice as ${type.toUpperCase()}`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    handleExport,
    isExporting
  };
};