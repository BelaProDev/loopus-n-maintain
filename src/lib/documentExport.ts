import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Document, Packer, Paragraph, TextRun } from "docx";
import type { Invoice } from "@/types/business";

// Safely initialize pdfMake with fonts
if (typeof window !== 'undefined') {
  pdfMake.vfs = pdfFonts.pdfMake?.vfs;
}

export const exportToPDF = async (invoice: Invoice) => {
  const docDefinition = {
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

  return new Promise((resolve) => {
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.getBlob((blob) => {
      resolve(blob);
    });
  });
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