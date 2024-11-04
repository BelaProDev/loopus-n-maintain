export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  vatNumber: string;
  totalInvoices: number;
  totalAmount: number;
  status: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  clientId: string;
  providerId: string;
  items: InvoiceItem[];
  status: string;
  totalAmount: number;
  tax: number;
  notes: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}