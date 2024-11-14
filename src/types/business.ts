import { QueryValueObject } from 'fauna';

export interface Client extends QueryValueObject {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  vatNumber: string;
  totalInvoices: number;
  totalAmount: number;
  status: string;
  [key: string]: any; // Required for QueryValueObject
}

export interface Provider extends QueryValueObject {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: 'electrics' | 'plumbing' | 'ironwork' | 'woodwork' | 'architecture';
  availability: boolean;
  rating: number;
  specialties: string[];
  [key: string]: any; // Required for QueryValueObject
}

export interface InvoiceItem extends QueryValueObject {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  vatRate: number;
  [key: string]: any; // Required for QueryValueObject
}

export interface Invoice extends QueryValueObject {
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
  [key: string]: any; // Required for QueryValueObject
}