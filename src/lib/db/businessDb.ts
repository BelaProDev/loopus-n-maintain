import fallbackDb from '../fallback-db.json';
import { Client, Provider, Invoice } from '@/types/business';

export const businessQueries = {
  // Client operations
  getClients: () => {
    return Promise.resolve(fallbackDb.clients);
  },
  
  createClient: (data: Omit<Client, 'id'>) => {
    const newClient: Client = {
      id: `client_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      company: data.company || '',
      vatNumber: data.vatNumber || '',
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
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service,
      availability: data.availability,
      rating: data.rating || 0,
      specialties: data.specialties || [],
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
      number: data.number,
      date: data.date,
      dueDate: data.dueDate,
      clientId: data.clientId,
      providerId: data.providerId,
      items: data.items,
      status: data.status,
      totalAmount: data.totalAmount,
      tax: data.tax,
      notes: data.notes || '',
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