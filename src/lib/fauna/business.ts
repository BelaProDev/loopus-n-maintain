import { Client as FaunaClient, fql } from 'fauna';
import type { Client, Provider, Invoice } from '@/types/business';
import { getFaunaClient } from './client';
import { extractFaunaData, handleFaunaError } from './utils';

const createBusinessQueries = (client: FaunaClient | null) => ({
  // Client operations
  getClients: async (): Promise<Client[]> => {
    if (!client) return [];
    try {
      const query = fql`Client.all()`;
      const result = await client.query(query);
      return extractFaunaData<Client>(result);
    } catch (error) {
      handleFaunaError(error);
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
      handleFaunaError(error);
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
      handleFaunaError(error);
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
      handleFaunaError(error);
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
      handleFaunaError(error);
      return [];
    }
  },

  createInvoice: async (data: Omit<Invoice, 'id'>) => {
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
      const result = await client.query(query);
      return extractFaunaData<Invoice>(result)[0];
    } catch (error) {
      handleFaunaError(error);
      return null;
    }
  }
});

export const businessQueries = createBusinessQueries(getFaunaClient());