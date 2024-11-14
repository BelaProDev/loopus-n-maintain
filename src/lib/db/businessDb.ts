import { Client, Provider, Invoice } from '@/types/business';
import { businessQueries as faunaBusinessQueries } from '@/lib/fauna/business';

export const businessQueries = {
  getClients: () => {
    return faunaBusinessQueries.getClients();
  },
  
  createClient: (data: Omit<Client, 'id' | 'totalInvoices' | 'totalAmount' | 'status'>) => {
    return faunaBusinessQueries.createClient(data);
  },

  getProviders: () => {
    return faunaBusinessQueries.getProviders();
  },
  
  createProvider: (data: Omit<Provider, 'id'>) => {
    return faunaBusinessQueries.createProvider(data);
  },

  getInvoices: () => {
    return faunaBusinessQueries.getInvoices();
  },
  
  createInvoice: (data: Omit<Invoice, 'id'>) => {
    return faunaBusinessQueries.createInvoice(data);
  },

  updateInvoiceStatus: (id: string, status: string) => {
    return faunaBusinessQueries.updateInvoiceStatus(id, status);
  },

  deleteInvoice: (id: string) => {
    return faunaBusinessQueries.deleteInvoice(id);
  }
};