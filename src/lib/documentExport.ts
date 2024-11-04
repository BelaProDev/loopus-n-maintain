import { Document, Packer, Paragraph, TextRun } from "docx";
import type { Invoice } from "@/types/business";

// Dynamically import pdfMake to avoid SSR issues
const getPdfMake = async () => {
  const pdfMake = (await import('pdfmake/build/pdfmake')).default;
  const pdfFonts = (await import('pdfmake/build/vfs_fonts')).pdfMake.vfs;
  pdfMake.vfs = pdfFonts;
  return pdfMake;
};

export const exportToPDF = async (invoice: Invoice) => {
  const docDefinition = {
    content: [
      { text: 'INVOICE', style: 'header', margin: [0, 0, 0, 20] },
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: `Invoice Number: ${invoice.number}`, margin: [0, 0, 0, 5] },
              { text: `Date: ${new Date(invoice.date).toLocaleDateString()}`, margin: [0, 0, 0, 5] },
              { text: `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, margin: [0, 0, 0, 20] }
            ]
          }
        ]
      },
      { text: 'Items:', style: 'subheader', margin: [0, 0, 0, 10] },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'Description', style: 'tableHeader' },
              { text: 'Quantity', style: 'tableHeader' },
              { text: 'Unit Price', style: 'tableHeader' },
              { text: 'VAT Rate', style: 'tableHeader' },
              { text: 'Total', style: 'tableHeader' }
            ],
            ...invoice.items.map(item => [
              item.description,
              { text: item.quantity.toString(), alignment: 'center' },
              { text: `€${item.unitPrice.toFixed(2)}`, alignment: 'right' },
              { text: `${(item.vatRate || 21)}%`, alignment: 'center' },
              { text: `€${item.total.toFixed(2)}`, alignment: 'right' }
            ])
          ]
        }
      },
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 'auto',
            stack: [
              { text: `Subtotal (excl. VAT): €${(invoice.totalAmount - invoice.tax).toFixed(2)}`, alignment: 'right', margin: [0, 10, 0, 5] },
              { text: `VAT (21%): €${invoice.tax.toFixed(2)}`, alignment: 'right', margin: [0, 0, 0, 5] },
              { text: `Total Amount (incl. VAT): €${invoice.totalAmount.toFixed(2)}`, style: 'total', alignment: 'right' }
            ]
          }
        ]
      },
      { text: 'Payment Information:', style: 'subheader', margin: [0, 30, 0, 10] },
      {
        style: 'paymentInfo',
        stack: [
          { text: 'Bank Transfer Details:', bold: true },
          { text: 'IBAN: BE00 0000 0000 0000' },
          { text: 'BIC: GEBABEBB' },
          { text: 'Bank: Example Bank' },
          { text: `Reference: ${invoice.number}` }
        ]
      },
      { text: 'Notes:', style: 'subheader', margin: [0, 30, 0, 10] },
      { text: invoice.notes || 'No notes', style: 'notes' },
      {
        text: 'VAT Number: BE0123456789',
        style: 'footer',
        margin: [0, 30, 0, 0]
      }
    ],
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        color: '#2563eb'
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 15, 0, 5]
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: '#1f2937'
      },
      total: {
        fontSize: 14,
        bold: true,
        color: '#2563eb'
      },
      notes: {
        fontSize: 12,
        color: '#4b5563',
        italics: true
      },
      paymentInfo: {
        fontSize: 12,
        color: '#1f2937',
        lineHeight: 1.4
      },
      footer: {
        fontSize: 12,
        color: '#4b5563',
        alignment: 'right'
      }
    },
    defaultStyle: {
      fontSize: 12,
      color: '#1f2937'
    }
  };

  try {
    const pdfMake = await getPdfMake();
    return new Promise((resolve, reject) => {
      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.getBlob((blob: Blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate PDF blob'));
        }
      });
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const exportToDOCX = async (invoice: Invoice) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: "INVOICE", bold: true, size: 40 })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Invoice Number: ${invoice.number}`, size: 24 })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Date: ${new Date(invoice.date).toLocaleDateString()}` })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}` })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Items:", bold: true, size: 28 })
          ]
        }),
        ...invoice.items.map(item => 
          new Paragraph({
            children: [
              new TextRun({ 
                text: `${item.description} - Qty: ${item.quantity} - Price: €${item.unitPrice} - Total: €${item.total}`
              })
            ]
          })
        ),
        new Paragraph({
          children: [
            new TextRun({ 
              text: `Total Amount: €${invoice.totalAmount.toFixed(2)}`,
              bold: true,
              size: 24
            })
          ]
        })
      ]
    }]
  });

  return await Packer.toBlob(doc);
};
