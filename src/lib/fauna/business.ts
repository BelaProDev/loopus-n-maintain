import { Client, fql, QueryArgument, type QuerySuccess } from 'fauna';
import type { Client as ClientType, Provider, Invoice, InvoiceItem } from '@/types/business';
import { getFaunaClient } from './client';

// Helper type for Fauna-compatible invoice items
type FaunaInvoiceItem = {
  [K in keyof InvoiceItem]: InvoiceItem[K];
} & QueryArgument;

export const businessQueries = {
  getClients: async () => {
    const client = getFaunaClient();
    if (!client) return [];

    try {
      const query = fql`Client.all()`;
      const result = await client.query<ClientType[]>(query);
      return result.data.map((doc: any) => ({
        id: doc.id,
        ...doc.data
      }));
    } catch (error) {
      console.error('Fauna query error:', error);
      return [];
    }
  },

  createClient: async (data: Omit<ClientType, 'id' | 'totalInvoices' | 'totalAmount' | 'status'>) => {
    const client = getFaunaClient();
    if (!client) return null;

    const clientData = {
      ...data,
      totalInvoices: 0,
      totalAmount: 0,
      status: 'active'
    };

    try {
      const query = fql`
        Client.create({
          data: ${clientData as QueryArgument}
        })
      `;
      const result = await client.query<QuerySuccess<ClientType>>(query);
      return {
        id: result.data.id,
        ...result.data
      };
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
      const result = await client.query<Provider[]>(query);
      return result.data.map((doc: any) => ({
        id: doc.id,
        ...doc.data
      }));
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
      return {
        id: result.data.id,
        ...result.data
      };
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
      const result = await client.query<Invoice[]>(query);
      return result.data.map((doc: any) => ({
        id: doc.id,
        ...doc.data
      }));
    } catch (error) {
      console.error('Fauna query error:', error);
      return [];
    }
  },

  createInvoice: async (data: Omit<Invoice, 'id'>) => {
    const client = getFaunaClient();
    if (!client) return null;

    // Convert invoice items to Fauna-compatible format
    const faunaItems = data.items.map(item => ({
      ...item,
      id: item.id || crypto.randomUUID()
    })) as FaunaInvoiceItem[];

    const invoiceData = {
      ...data,
      items: faunaItems
    };

    try {
      const query = fql`
        Invoice.create({
          data: ${invoiceData as QueryArgument}
        })
      `;
      const result = await client.query<QuerySuccess<Invoice>>(query);
      return {
        id: result.data.id,
        ...result.data
      };
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