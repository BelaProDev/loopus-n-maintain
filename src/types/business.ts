export interface WhatsAppNumber {
  id: string;
  name: string;
  number: string;
  service: 'electrics' | 'plumbing' | 'ironwork' | 'woodwork' | 'architecture';
}

export type WhatsAppNumbers = WhatsAppNumber[];

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  vatNumber: string;
  status: 'active' | 'inactive';
  totalInvoices: number;
  totalAmount: number;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  availability: boolean;
  specialties: string[];
}

export interface InvoiceItem {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  vatRate: number;
  unit: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  clientId: string;
  providerId: string;
  client?: {
    id: string;
    name: string;
  };
  provider?: {
    id: string;
    name: string;
  };
  items: InvoiceItem[];
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  totalAmount: number;
  tax: number;
  notes: string;
  paymentTerms: string;
  currency: string;
}