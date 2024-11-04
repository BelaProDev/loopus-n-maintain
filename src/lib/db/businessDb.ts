import fallbackDb from '../fallback-db.json';

export const businessQueries = {
  // Client operations
  getClients: () => fallbackDb.clients,
  
  createClient: (data: any) => {
    const newClient = { id: `client_${Date.now()}`, ...data };
    fallbackDb.clients.push(newClient);
    return newClient;
  },

  // Provider operations
  getProviders: () => fallbackDb.providers,
  
  createProvider: (data: any) => {
    const newProvider = { id: `provider_${Date.now()}`, ...data };
    fallbackDb.providers.push(newProvider);
    return newProvider;
  },

  // Invoice operations
  getInvoices: () => fallbackDb.invoices,
  
  createInvoice: (data: any) => {
    const newInvoice = { id: `inv_${Date.now()}`, ...data };
    fallbackDb.invoices.push(newInvoice);
    return newInvoice;
  },

  updateInvoiceStatus: (id: string, status: string) => {
    const invoice = fallbackDb.invoices.find(inv => inv.id === id);
    if (invoice) {
      invoice.status = status;
      return invoice;
    }
    throw new Error('Invoice not found');
  },

  deleteInvoice: (id: string) => {
    const index = fallbackDb.invoices.findIndex(inv => inv.id === id);
    if (index !== -1) {
      fallbackDb.invoices.splice(index, 1);
      return { success: true };
    }
    throw new Error('Invoice not found');
  }
};