import { Client as FaunaClient, fql, QueryArgument, type QuerySuccess } from 'fauna';
import type { Client, Provider, Invoice } from '@/types/business';
import { getFaunaClient } from './client';

const extractFaunaData = <T>(result: any): T[] => {
  if (!result?.data?.['@set']?.data) return [];
  return result.data['@set'].data.map((item: any) => item['@doc']);
};

export const businessQueries = {
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
        let clientData = {
          name: ${data.name},
          email: ${data.email},
          phone: ${data.phone},
          company: ${data.company},
          vatNumber: ${data.vatNumber},
          totalInvoices: 0,
          totalAmount: 0,
          status: "active"
        }
        Client.create(clientData)
      `;
      const result = await client.query<QuerySuccess<Client>>(query);
      return result.data;
    } catch (error) {
      console.error('Fauna create error:', error);
      return null;
    }
  },

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

  createProvider: async (data: Omit<Provider, 'id'>) => {
    const client = getFaunaClient();
    if (!client) return null;

    try {
      const query = fql`
        Provider.create({
          data: ${data as QueryArgument}
        })
      `;
      const result = await client.query<QuerySuccess<Provider>>(query);
      return result.data;
    } catch (error) {
      console.error('Fauna create error:', error);
      return null;
    }
  },

  createInvoice: async (data: Omit<Invoice, 'id'>) => {
    const client = getFaunaClient();
    if (!client) return null;

    try {
      const query = fql`
        Invoice.create({
          data: ${data as QueryArgument}
        })
      `;
      const result = await client.query<QuerySuccess<Invoice>>(query);
      return result.data;
    } catch (error) {
      console.error('Fauna create error:', error);
      return null;
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
      return null;
    }
  }
};
