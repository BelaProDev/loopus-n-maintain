import { QueryValueObject } from 'fauna';

export interface InvoiceItem extends QueryValueObject {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  vatRate: number;
  unit: string;
  [key: string]: any;
}

export interface Invoice extends QueryValueObject {
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
  [key: string]: any;
}

export interface CreateInvoiceDTO {
  clientId: string;
  providerId: string;
  notes: string;
  items: InvoiceItem[];
  paymentTerms?: string;
  currency?: string;
}