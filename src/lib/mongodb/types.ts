import { ObjectId } from 'mongodb';

export interface BaseDocument {
  _id?: ObjectId;
  createdAt?: number;
  updatedAt?: number;
}

export interface EmailDocument extends BaseDocument {
  email: string;
  name: string;
  type: string;
  password?: string;
}

export interface ContentDocument extends BaseDocument {
  key: string;
  type: 'text' | 'textarea' | 'wysiwyg';
  content: string;
  language: string;
  lastModified: number;
  modifiedBy: string;
}

export interface BusinessDocument extends BaseDocument {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  vatNumber?: string;
  type: 'client' | 'provider';
}

export interface InvoiceDocument extends BaseDocument {
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

export interface DbCollection<T> {
  find: (query?: any) => Promise<T[]>;
  findOne: (query: any) => Promise<T | null>;
  insertOne: (doc: Omit<T, '_id'>) => Promise<{ insertedId: string }>;
  updateOne: (query: any, update: any, options?: any) => Promise<{ matchedCount: number }>;
  deleteOne: (query: any) => Promise<{ deletedCount: number }>;
}

export interface MongoDatabase {
  collection<T extends BaseDocument>(name: string): DbCollection<T>;
}