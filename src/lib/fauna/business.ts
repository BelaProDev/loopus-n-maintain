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
      const documents = extractFaunaData<Client>(result);
      return documents.map(doc => ({ id: doc.ref.id, ...doc.data }));
    } catch (error) {
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
      const document = extractFaunaData<Client>(result)[0];
      return document ? { id: document.ref.id, ...document.data } : null;
    } catch (error) {
      return null;
    }
  },

  getProviders: async (): Promise<Provider[]> => {
    if (!client) return [];
    try {
      const query = fql`providers.all()`;
      const result = await client.query(query);
      const documents = extractFaunaData<Provider>(result);
      return documents.map(doc => ({ id: doc.ref.id, ...doc.data }));
    } catch (error) {
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
      const document = extractFaunaData<Provider>(result)[0];
      return document ? { id: document.ref.id, ...document.data } : null;
    } catch (error) {
      return null;
    }
  },

  getInvoices: async (): Promise<Invoice[]> => {
    if (!client) return [];
    try {
      const query = fql`invoices.all()`;
      const result = await client.query(query);
      const documents = extractFaunaData<Invoice>(result);
      return documents.map(doc => ({
        id: doc.ref?.id || '',
        ...doc.data,
        date: doc.data.date?.toString?.() || new Date().toISOString(),
        dueDate: doc.data.dueDate?.toString?.() || new Date().toISOString(),
        items: doc.data.items || [],
        totalAmount: Number(doc.data.totalAmount?.['@int'] || 0),
        tax: Number(doc.data.tax?.['@int'] || 0),
        notes: doc.data.notes || ''
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
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
          items: ${data.items || []},
          status: ${data.status},
          totalAmount: ${data.totalAmount || 0},
          tax: ${data.tax || 0},
          notes: ${data.notes || ''}
        })
      `;
      const result = await client.query(query);
      const document = extractFaunaData<Invoice>(result)[0];
      if (!document) return null;
      
      return {
        id: document.ref.id,
        ...document.data,
        totalAmount: Number(document.data.totalAmount?.['@int'] || 0),
        tax: Number(document.data.tax?.['@int'] || 0),
        date: document.data.date?.toString() || new Date().toISOString(),
        dueDate: document.data.dueDate?.toString() || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating invoice:', error);
      return null;
    }
  },

  deleteInvoice: async (id: string): Promise<boolean> => {
    if (!client) return false;
    try {
      const query = fql`invoices.byId(${id}).delete()`;
      await client.query(query);
      return true;
    } catch (error) {
      return false;
    }
  }
});

export const businessQueries = createBusinessQueries(getFaunaClient());
