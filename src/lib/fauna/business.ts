import { Client as FaunaClient, fql, QueryArgument, type QuerySuccess } from 'fauna';
import type { Client, Provider, Invoice } from '@/types/business';
import { getFaunaClient } from './client';

const extractFaunaData = <T>(result: any): T[] => {
  if (!result?.data?.['@set']?.data) return [];
  return result.data['@set'].data.map((item: any) => item['@doc']);
};

export const businessQueries = {
  // Client operations
  getClients: async (): Promise<Client[]> => {
    const client = getFaunaClient();
    if (!client) return [];

    try {
      const query = fql`Client.all()`;
      const result = await client.query(query);
      return extractFaunaData<Client>(result);
    } catch (error) {
      console.error('Fauna query error:', error);
      return [];
    }
  },

  createClient: async (data: Omit<Client, 'id' | 'totalInvoices' | 'totalAmount' | 'status'>) => {
    const client = getFaunaClient();
    if (!client) return null;

    try {
      const query = fql`
        Client.create({
          name: ${data.name},
          email: ${data.email},
          phone: ${data.phone},
          company: ${data.company},
          vatNumber: ${data.vatNumber},
          totalInvoices: 0,
          totalAmount: 0,
          status: "active"
        })
      `;
      const result = await client.query<QuerySuccess<Client>>(query);
      return result.data;
    } catch (error) {
      console.error('Fauna create error:', error);
      throw error;
    }
  },

  updateClient: async (id: string, data: Partial<Client>) => {
    const client = getFaunaClient();
    if (!client) return null;

    try {
      const query = fql`
        let client = Client.byId(${id})
        client.update(${data as QueryArgument})
      `;
      const result = await client.query<QuerySuccess<Client>>(query);
      return result.data;
    } catch (error) {
      console.error('Fauna update error:', error);
      throw error;
    }
  },

  deleteClient: async (id: string) => {
    const client = getFaunaClient();
    if (!client) return null;

    try {
      const query = fql`Client.byId(${id})?.delete()`;
      await client.query(query);
      return { success: true };
    } catch (error) {
      console.error('Fauna delete error:', error);
      throw error;
    }
  },

  // Provider operations
  getProviders: async (): Promise<Provider[]> => {
    const client = getFaunaClient();
    if (!client) return [];

    try {
      const query = fql`Provider.all()`;
      const result = await client.query(query);
      return extractFaunaData<Provider>(result);
    } catch (error) {
      console.error('Fauna query error:', error);
      return [];
    }
  },

  createProvider: async (data: Omit<Provider, 'id'>) => {
    const client = getFaunaClient();
    if (!client) return null;

    try {
      const query = fql`
        Provider.create({
          name: ${data.name},
          email: ${data.email},
          phone: ${data.phone},
          service: ${data.service},
          availability: ${data.availability},
          rating: ${data.rating},
          specialties: ${data.specialties}
        })
      `;
      const result = await client.query<QuerySuccess<Provider>>(query);
      return result.data;
    } catch (error) {
      console.error('Fauna create error:', error);
      throw error;
    }
  },

  updateProvider: async (id: string, data: Partial<Provider>) => {
    const client = getFaunaClient();
    if (!client) return null;

    try {
      const query = fql`
        let provider = Provider.byId(${id})
        provider.update(${data as QueryArgument})
      `;
      const result = await client.query<QuerySuccess<Provider>>(query);
      return result.data;
    } catch (error) {
      console.error('Fauna update error:', error);
      throw error;
    }
  },

  deleteProvider: async (id: string) => {
    const client = getFaunaClient();
    if (!client) return null;

    try {
      const query = fql`Provider.byId(${id})?.delete()`;
      await client.query(query);
      return { success: true };
    } catch (error) {
      console.error('Fauna delete error:', error);
      throw error;
    }
  },

  // Invoice operations
  getInvoices: async (): Promise<Invoice[]> => {
    const client = getFaunaClient();
    if (!client) return [];

    try {
      const query = fql`Invoice.all()`;
      const result = await client.query(query);
      return extractFaunaData<Invoice>(result);
    } catch (error) {
      console.error('Fauna query error:', error);
      return [];
    }
  },

  createInvoice: async (data: Omit<Invoice, 'id'>) => {
    const client = getFaunaClient();
    if (!client) return null;

    try {
      const query = fql`
        Invoice.create({
          number: ${data.number},
          date: ${data.date},
          dueDate: ${data.dueDate},
          clientId: ${data.clientId},
          providerId: ${data.providerId},
          items: ${data.items},
          status: ${data.status},
          totalAmount: ${data.totalAmount},
          tax: ${data.tax},
          notes: ${data.notes}
        })
      `;
      const result = await client.query<QuerySuccess<Invoice>>(query);
      return result.data;
    } catch (error) {
      console.error('Fauna create error:', error);
      throw error;
    }
  },

  updateInvoice: async (id: string, data: Partial<Invoice>) => {
    const client = getFaunaClient();
    if (!client) return null;

    try {
      const query = fql`
        let invoice = Invoice.byId(${id})
        invoice.update(${data as QueryArgument})
      `;
      const result = await client.query<QuerySuccess<Invoice>>(query);
      return result.data;
    } catch (error) {
      console.error('Fauna update error:', error);
      throw error;
    }
  },

  deleteInvoice: async (id: string) => {
    const client = getFaunaClient();
    if (!client) return null;

    try {
      const query = fql`Invoice.byId(${id})?.delete()`;
      await client.query(query);
      return { success: true };
    } catch (error) {
      console.error('Fauna delete error:', error);
      throw error;
    }
  }
};