import pdfMake from 'pdfmake-browser';
import { TDocumentDefinitions } from 'pdfmake-browser';
import type { Invoice } from "@/types/business";

// Initialize pdfMake with empty virtual file system
pdfMake.vfs = {};

export const exportToPDF = async (invoice: Invoice) => {
  const docDefinition: TDocumentDefinitions = {
    content: [
      { text: 'INVOICE', style: 'header' },
      { text: `Invoice Number: ${invoice.number}`, margin: [0, 20, 0, 10] },
      { text: `Date: ${new Date(invoice.date).toLocaleDateString()}` },
      { text: `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}` },
      { text: 'Items:', style: 'subheader', margin: [0, 20, 0, 10] },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto'],
          body: [
            ['Description', 'Quantity', 'Unit Price', 'Total'],
            ...invoice.items.map(item => [
              item.description,
              item.quantity.toString(),
              `€${item.unitPrice.toFixed(2)}`,
              `€${item.total.toFixed(2)}`
            ])
          ]
        }
      },
      {
        text: `Total Amount: €${invoice.totalAmount.toFixed(2)}`,
        style: 'total',
        margin: [0, 20, 0, 0]
      }
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true
      },
      subheader: {
        fontSize: 16,
        bold: true
      },
      total: {
        fontSize: 14,
        bold: true,
        alignment: 'right'
      }
    }
  };

  return new Promise<Blob>((resolve, reject) => {
    try {
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getBlob((blob: Blob) => {
        resolve(blob);
      });
    } catch (error) {
      reject(error);
    }
  });
};