import { getFaunaClient } from './client';
import { fql } from 'fauna';
import type { Client, Provider, Invoice } from '@/types/business';
import { extractFaunaData } from './utils';

const createBusinessQueries = (client: ReturnType<typeof getFaunaClient>) => ({
  getClients: async (): Promise<Client[]> => {
    if (!client) return [];
    try {
      const query = fql`clients.all()`;
      const result = await client.query(query);
      console.log('Raw Clients Response:', JSON.stringify(result, null, 2));
      const documents = extractFaunaData<Client>(result);
      console.log('Extracted Clients:', documents);
      return documents.map(doc => ({ id: doc.ref.id, ...doc.data }));
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      return [];
    }
  },

  createClient: async (data: Omit<Client, 'id' | 'totalInvoices' | 'totalAmount' | 'status'>) => {
    if (!client) return null;
    try {
      const query = fql`
        clients.create({
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
      console.log('Create Client Response:', JSON.stringify(result, null, 2));
      const document = extractFaunaData<Client>(result)[0];
      return document ? { id: document.ref.id, ...document.data } : null;
    } catch (error) {
      console.error('Failed to create client:', error);
      return null;
    }
  },

  getProviders: async (): Promise<Provider[]> => {
    if (!client) return [];
    try {
      const query = fql`providers.all()`;
      const result = await client.query(query);
      console.log('Raw Providers Response:', JSON.stringify(result, null, 2));
      const documents = extractFaunaData<Provider>(result);
      console.log('Extracted Providers:', documents);
      return documents.map(doc => ({ id: doc.ref.id, ...doc.data }));
    } catch (error) {
      console.error('Failed to fetch providers:', error);
      return [];
    }
  },

  createProvider: async (data: Omit<Provider, 'id'>) => {
    if (!client) return null;
    try {
      const query = fql`
        providers.create({
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
      console.log('Create Provider Response:', JSON.stringify(result, null, 2));
      const document = extractFaunaData<Provider>(result)[0];
      return document ? { id: document.ref.id, ...document.data } : null;
    } catch (error) {
      console.error('Failed to create provider:', error);
      return null;
    }
  },

  getInvoices: async (): Promise<Invoice[]> => {
    if (!client) return [];
    try {
      const query = fql`invoices.all()`;
      const result = await client.query(query);
      console.log('Raw Invoices Response:', JSON.stringify(result, null, 2));
      const documents = extractFaunaData<Invoice>(result);
      console.log('Extracted Invoices:', documents);
      return documents.map(doc => ({ id: doc.ref.id, ...doc.data }));
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      return [];
    }
  },

  createInvoice: async (data: Omit<Invoice, 'id'>) => {
    if (!client) return null;
    try {
      const query = fql`
        invoices.create({
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
      console.log('Create Invoice Response:', JSON.stringify(result, null, 2));
      const document = extractFaunaData<Invoice>(result)[0];
      return document ? { id: document.ref.id, ...document.data } : null;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      return null;
    }
  },

  deleteInvoice: async (id: string): Promise<boolean> => {
    if (!client) return false;
    try {
      const query = fql`invoices.byId(${id}).delete()`;
      const result = await client.query(query);
      console.log('Delete Invoice Response:', JSON.stringify(result, null, 2));
      return true;
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      return false;
    }
  }
});

export const businessQueries = createBusinessQueries(getFaunaClient());