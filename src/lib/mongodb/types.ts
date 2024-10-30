export interface BaseDocument {
  _id?: string;
  [key: string]: any;
}

export interface DbQueryResult<T> {
  data: T[];
  sort: (field: keyof T) => DbQueryResult<T>;
  toArray: () => Promise<T[]>;
  map: <U>(callback: (value: T, index: number, array: T[]) => U) => U[];
}

export interface DbCollection<T> {
  find: (query?: Record<string, any>) => Promise<DbQueryResult<T>>;
  findOne: (query: Record<string, any>) => Promise<T | null>;
  insertOne: (doc: T) => Promise<{ insertedId: string }>;
  updateOne: (query: Record<string, any>, update: { $set: Partial<T> }) => Promise<{ matchedCount: number; upsertedId: string | null }>;
  deleteOne: (query: Record<string, any>) => Promise<{ deletedCount: number }>;
}

export interface MongoDatabase {
  collection: <T extends BaseDocument>(name: string) => DbCollection<T>;
}

export interface ContentDocument extends BaseDocument {
  key: string;
  type: 'text' | 'textarea' | 'wysiwyg';
  content: string;
  language: string;
  lastModified: number;
  modifiedBy: string;
}

export interface EmailDocument extends BaseDocument {
  email: string;
  name: string;
  type: string;
}

export interface BusinessDocument extends BaseDocument {
  type: 'client' | 'provider';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  vatNumber?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface InvoiceDocument extends BaseDocument {
  number: string;
  clientId: string;
  providerId: string;
  date: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  totalAmount: number;
  tax: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
  createdAt?: number;
  updatedAt?: number;
}