import { BusinessDocument } from '../types';

export type BusinessOperation = {
  createClient: (data: Omit<BusinessDocument, '_id'>) => Promise<any>;
  getClients: () => Promise<any[]>;
  updateClient: (id: string, data: Partial<BusinessDocument>) => Promise<any>;
  deleteClient: (id: string) => Promise<{ success: boolean }>;
  createProvider: (data: Omit<BusinessDocument, '_id'>) => Promise<any>;
  getProviders: () => Promise<any[]>;
  updateProvider: (id: string, data: Partial<BusinessDocument>) => Promise<any>;
  deleteProvider: (id: string) => Promise<{ success: boolean }>;
};

export type InvoiceOperation = {
  createInvoice: (data: any) => Promise<any>;
  getInvoices: () => Promise<any[]>;
  updateInvoiceStatus: (id: string, status: string) => Promise<any>;
  deleteInvoice: (id: string) => Promise<{ success: boolean }>;
};