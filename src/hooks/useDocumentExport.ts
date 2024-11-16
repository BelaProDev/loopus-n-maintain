import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Invoice } from "@/types/business";
import { exportToPDF, exportToDOCX } from "@/lib/documentExport";
import { dropboxClient } from '@/lib/dropbox';
import * as XLSX from 'xlsx';

export const useDocumentExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportToExcel = async (invoice: Invoice): Promise<Blob> => {
    const wb = XLSX.utils.book_new();
    const invoiceData = [
      ['Invoice Number', invoice.number],
      ['Date', new Date(invoice.date).toLocaleDateString()],
      ['Due Date', new Date(invoice.dueDate).toLocaleDateString()],
      [''],
      ['Description', 'Quantity', 'Unit Price', 'VAT Rate', 'Total']
    ];

    invoice.items.forEach(item => {
      invoiceData.push([
        item.description,
        item.quantity.toString(),
        item.unitPrice.toString(),
        `${item.vatRate}%`,
        item.total.toString()
      ]);
    });

    invoiceData.push(
      [''],
      ['Subtotal (excl. VAT)', '', '', '', (invoice.totalAmount - invoice.tax).toString()],
      ['VAT', '', '', '', invoice.tax.toString()],
      ['Total Amount (incl. VAT)', '', '', '', invoice.totalAmount.toString()]
    );

    const ws = XLSX.utils.aoa_to_sheet(invoiceData);
    XLSX.utils.book_append_sheet(wb, ws, 'Invoice');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  const handleExport = async (invoice: Invoice, type: 'pdf' | 'docx' | 'xlsx') => {
    setIsExporting(true);
    try {
      let blob: Blob;
      
      switch (type) {
        case 'pdf':
          blob = await exportToPDF(invoice) as Blob;
          break;
        case 'docx':
          blob = await exportToDOCX(invoice);
          break;
        case 'xlsx':
          blob = await exportToExcel(invoice);
          break;
        default:
          throw new Error('Unsupported file type');
      }

      const tokens = JSON.parse(sessionStorage.getItem('dropbox_tokens') || '{}');
      if (tokens.access_token) {
        try {
          await dropboxClient.uploadFile(blob, `/invoices/${invoice.number}.${type}`);
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