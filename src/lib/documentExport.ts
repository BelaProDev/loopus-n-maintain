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
  try {
    const response = await fetch('/.netlify/functions/generate-pdf', {
      method: 'POST',
      body: JSON.stringify(invoice),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    const blob = await response.blob();
    return blob;
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
