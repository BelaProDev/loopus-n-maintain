import { ObjectId } from 'mongodb';

export interface EmailDocument {
  _id?: ObjectId;
  email: string;
  name: string;
  type: string;
  password?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ContentDocument {
  _id?: ObjectId;
  key: string;
  type: 'text' | 'textarea' | 'wysiwyg';
  content: string;
  language: string;
  lastModified: number;
  modifiedBy: string;
}

export interface BusinessDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  vatNumber?: string;
  type: 'client' | 'provider';
}

export interface InvoiceDocument {
  _id?: ObjectId;
  number: string;
  clientId: string;
  providerId: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  totalAmount: number;
  tax: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}