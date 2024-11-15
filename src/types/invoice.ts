import { QueryValueObject } from 'fauna';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  vatRate: number;
}

export interface Invoice extends QueryValueObject {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  clientId: string;
  providerId: string;
  items: InvoiceItem[];
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  totalAmount: number;
  tax: number;
  notes: string;
}

export interface CreateInvoiceDTO {
  clientId: string;
  providerId: string;
  notes: string;
  items: InvoiceItem[];
}