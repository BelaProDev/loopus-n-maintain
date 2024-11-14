import { Client as FaunaClient, fql } from 'fauna';
import type { Client, Provider, Invoice } from '@/types/business';
import { getFaunaClient } from './client';
import { extractFaunaData } from './utils';

const createBusinessQueries = (client: FaunaClient | null) => ({
  // Client operations
  getClients: async (): Promise<Client[]> => {
    if (!client) return [];
    try {
      const query = fql`Client.all()`;
      const result = await client.query(query);
      return extractFaunaData<Client>(result);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      return [];
    }
  },

  createClient: async (data: Omit<Client, 'id' | 'totalInvoices' | 'totalAmount' | 'status'>) => {
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
      const result = await client.query(query);
      return extractFaunaData<Client>(result)[0];
    } catch (error) {
      console.error('Failed to create client:', error);
      return null;
    }
  },

  // Provider operations
  getProviders: async (): Promise<Provider[]> => {
    if (!client) return [];
    try {
      const query = fql`Provider.all()`;
      const result = await client.query(query);
      return extractFaunaData<Provider>(result);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
      return [];
    }
  },

  createProvider: async (data: Omit<Provider, 'id'>) => {
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
      const result = await client.query(query);
      return extractFaunaData<Provider>(result)[0];
    } catch (error) {
      console.error('Failed to create provider:', error);
      return null;
    }
  },

  // Invoice operations
  getInvoices: async (): Promise<Invoice[]> => {
    if (!client) return [];
    try {
      const query = fql`Invoice.all()`;
      const result = await client.query(query);
      return extractFaunaData<Invoice>(result);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      return [];
    }
  },

  createInvoice: async (data: Omit<Invoice, 'id'>) => {
    if (!client) return null;
    try {
      const query = fql`
        Invoice.create({
          number: ${data.number},
          date: Time(${data.date}),
          dueDate: Time(${data.dueDate}),
          clientId: ${data.clientId},
          providerId: ${data.providerId},
          items: ${data.items},
          status: ${data.status},
          totalAmount: ${data.totalAmount},
          tax: ${data.tax},
          notes: ${data.notes}
        })
      `;
      const result = await client.query(query);
      return extractFaunaData<Invoice>(result)[0];
    } catch (error) {
      console.error('Failed to create invoice:', error);
      return null;
    }
  },

  deleteInvoice: async (id: string): Promise<boolean> => {
    if (!client) return false;
    try {
      const query = fql`Invoice.byId(${id}).delete()`;
      await client.query(query);
      return true;
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      return false;
    }
  }
});

export const businessQueries = createBusinessQueries(getFaunaClient());