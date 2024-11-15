import { QueryValueObject } from 'fauna';

export interface InvoiceItem extends QueryValueObject {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  vatRate: number;
  [key: string]: any; // Add index signature for Fauna compatibility
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
  [key: string]: any; // Add index signature for Fauna compatibility
}

export interface CreateInvoiceDTO {
  clientId: string;
  providerId: string;
  notes: string;
  items: InvoiceItem[];
}