import { QueryValueObject } from 'fauna';

export interface Client extends QueryValueObject {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  vatNumber: string;
  status: 'active' | 'inactive';
}

export interface Provider extends QueryValueObject {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: 'electrics' | 'plumbing' | 'ironwork' | 'woodwork' | 'architecture';
  availability: boolean;
  specialties: string[];
}

export interface InvoiceItem extends QueryValueObject {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  vatRate: number;
  unit: string;
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
  paymentTerms: string;
  currency: string;
}