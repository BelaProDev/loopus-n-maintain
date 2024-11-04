import fallbackDb from '../fallback-db.json';
import { Client, Provider, Invoice } from '@/types/business';

export const businessQueries = {
  // Client operations
  getClients: () => {
    return Promise.resolve(fallbackDb.clients);
  },
  
  createClient: (data: Omit<Client, 'id' | 'totalInvoices' | 'totalAmount' | 'status'>) => {
    const newClient: Client = {
      id: `client_${Date.now()}`,
      ...data,
      totalInvoices: 0,
      totalAmount: 0,
      status: 'active'
    };
    fallbackDb.clients.push(newClient);
    return Promise.resolve(newClient);
  },

  // Provider operations
  getProviders: () => {
    return Promise.resolve(fallbackDb.providers);
  },
  
  createProvider: (data: Omit<Provider, 'id'>) => {
    const newProvider: Provider = {
      id: `provider_${Date.now()}`,
      ...data,
    };
    fallbackDb.providers.push(newProvider);
    return Promise.resolve(newProvider);
  },

  // Invoice operations
  getInvoices: () => {
    return Promise.resolve(fallbackDb.invoices);
  },
  
  createInvoice: (data: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      ...data,
    };
    fallbackDb.invoices.push(newInvoice);
    return Promise.resolve(newInvoice);
  },

  updateInvoiceStatus: (id: string, status: string) => {
    const invoice = fallbackDb.invoices.find(inv => inv.id === id);
    if (invoice) {
      invoice.status = status;
      return Promise.resolve(invoice);
    }
    return Promise.reject(new Error('Invoice not found'));
  },

  deleteInvoice: (id: string) => {
    const index = fallbackDb.invoices.findIndex(inv => inv.id === id);
    if (index !== -1) {
      fallbackDb.invoices.splice(index, 1);
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error('Invoice not found'));
  }
};