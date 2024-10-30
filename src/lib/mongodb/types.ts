import { ObjectId } from 'mongodb';

export interface BaseDocument {
  _id?: ObjectId;
  createdAt?: number;
  updatedAt?: number;
  type?: string;
  key?: string;
  language?: string;
  status?: string;
  numbers?: Record<string, string>;
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

export interface DbQueryResult<T> {
  data: T[];
  sort: (field: keyof T) => DbQueryResult<T>;
  toArray: () => Promise<T[]>;
}

export interface DbCollection<T extends BaseDocument> {
  find: (query?: Partial<T>) => Promise<DbQueryResult<T>>;
  findOne: (query: Partial<T>) => Promise<T | null>;
  insertOne: (doc: Omit<T, '_id'>) => Promise<{ insertedId: string }>;
  updateOne: (
    query: Partial<T>,
    update: { $set: Partial<T> },
    options?: { upsert?: boolean }
  ) => Promise<{
    matchedCount: number;
    upsertedId?: string;
  }>;
  deleteOne: (query: Partial<T>) => Promise<{ deletedCount: number }>;
}

export interface MongoDatabase {
  collection<T extends BaseDocument>(name: string): DbCollection<T>;
}

export interface SettingsDocument extends BaseDocument {
  type: string;
  numbers?: Record<string, string>;
  [key: string]: any;
}