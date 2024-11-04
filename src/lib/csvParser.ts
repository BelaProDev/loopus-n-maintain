import { Invoice, InvoiceItem } from "@/types/business";

export const parseInvoiceCSV = (csvContent: string): Partial<Invoice> => {
  const lines = csvContent.split('\n').map(line => line.trim());
  if (lines.length < 2) throw new Error('Invalid CSV format');

  // Parse header information
  const headerInfo: { [key: string]: string } = {};
  for (let i = 0; i < 3; i++) {
    const [key, value] = lines[i].split(',').map(s => s.trim());
    if (key && value) headerInfo[key.toLowerCase()] = value;
  }

  // Parse items starting from line 5 (after header and column names)
  const items: InvoiceItem[] = [];
  for (let i = 5; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    const [description, quantity, unitPrice, vatRate] = line.split(',').map(s => s.trim());
    if (description && quantity && unitPrice && vatRate) {
      const qty = Number(quantity);
      const price = Number(unitPrice);
      const vat = Number(vatRate);
      
      items.push({
        id: crypto.randomUUID(),
        description,
        quantity: qty,
        unitPrice: price,
        vatRate: vat,
        total: qty * price
      });
    }
  }

  // Calculate totals
  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
  const tax = items.reduce((sum, item) => sum + (item.total * item.vatRate / 100), 0);

  return {
    number: headerInfo['invoice number'] || `INV-${Date.now()}`,
    date: headerInfo['date'] || new Date().toISOString(),
    dueDate: headerInfo['due date'] || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    items,
    totalAmount,
    tax,
    status: 'draft',
    notes: ''
  };
};