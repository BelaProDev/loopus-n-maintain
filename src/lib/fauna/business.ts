import { Client, fql } from 'fauna';
import { Client as BusinessClient, Provider, Invoice } from '@/types/business';
import { handleFaunaError, sanitizeForFauna } from './utils';

const getFaunaClient = () => {
  if (typeof window === 'undefined') return null;
  return new Client({
    secret: import.meta.env.VITE_FAUNA_SECRET_KEY,
  });
};

export const businessQueries = {
  // Client queries
  createClient: async (data: Omit<BusinessClient, 'id'>) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const sanitizedData = sanitizeForFauna(data);
      return await client.query(fql`
        Collection.byName("clients").create({
          data: ${sanitizedData}
        })
      `);
    } catch (error) {
      return handleFaunaError(error, { data });
    }
  },

  getClients: async () => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        Collection.byName("clients").all().documents
      `);
      return result.data;
    } catch (error) {
      return handleFaunaError(error, []);
    }
  },

  // Provider queries
  createProvider: async (data: Omit<Provider, 'id'>) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const sanitizedData = sanitizeForFauna(data);
      return await client.query(fql`
        Collection.byName("providers").create({
          data: ${sanitizedData}
        })
      `);
    } catch (error) {
      return handleFaunaError(error, { data });
    }
  },

  getProviders: async () => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        Collection.byName("providers").all().documents
      `);
      return result.data;
    } catch (error) {
      return handleFaunaError(error, []);
    }
  },

  // Invoice queries
  createInvoice: async (data: Omit<Invoice, 'id'>) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const sanitizedData = sanitizeForFauna(data);
      return await client.query(fql`
        Collection.byName("invoices").create({
          data: ${sanitizedData}
        })
      `);
    } catch (error) {
      return handleFaunaError(error, { data });
    }
  },

  getInvoices: async () => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        Collection.byName("invoices").all().documents
      `);
      return result.data;
    } catch (error) {
      return handleFaunaError(error, []);
    }
  },

  updateInvoiceStatus: async (id: string, status: Invoice['status']) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const sanitizedData = sanitizeForFauna({ status });
      return await client.query(fql`
        Collection.byName("invoices").document(${id}).update({
          data: ${sanitizedData}
        })
      `);
    } catch (error) {
      return handleFaunaError(error, { id, status });
    }
  },

  deleteInvoice: async (id: string) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      return await client.query(fql`
        Collection.byName("invoices").document(${id}).delete()
      `);
    } catch (error) {
      return handleFaunaError(error, { id });
    }
  }
};
