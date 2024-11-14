import { Client as FaunaClient, fql, QueryArgument, type QuerySuccess } from 'fauna';
import type { Client, Provider, Invoice } from '@/types/business';
import { getFaunaClient } from './client';

export const businessQueries = {
  getClients: async () => {
    const client = getFaunaClient();
    if (!client) return [];

    try {
      const query = fql`Client.all()`;
      const result = await client.query<QuerySuccess<Client[]>>(query);
      return result.data;
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
        Client.create({ data: clientData })
      `;
      const result = await client.query<QuerySuccess<Client>>(query);
      return result.data;
    } catch (error) {
      console.error('Fauna create error:', error);
      return null;
    }
  },

  getProviders: async () => {
    const client = getFaunaClient();
    if (!client) return [];

    try {
      const query = fql`Provider.all()`;
      const result = await client.query<QuerySuccess<Provider[]>>(query);
      return Array.isArray(result.data) ? result.data : [];
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

  getInvoices: async () => {
    const client = getFaunaClient();
    if (!client) return [];

    try {
      const query = fql`Invoice.all()`;
      const result = await client.query<QuerySuccess<Invoice[]>>(query);
      return Array.isArray(result.data) ? result.data : [];
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