import { getFaunaClient, handleFaunaError } from './client';
import { fql } from 'fauna';
import fallbackDb from '../fallback-db.json';
import { Client, Provider, Invoice } from '@/types/business';

export const businessQueries = {
  getClients: async () => {
    const client = getFaunaClient();
    if (!client) return fallbackDb.clients;

    try {
      const result = await client.query(fql`
        Collection.byName("clients")?.documents()
          .map(doc => ({
            ref: { id: doc.id },
            data: doc.data
          })) ?? []
      `);
      return result.data;
    } catch (error) {
      return fallbackDb.clients;
    }
  },

  getProviders: async () => {
    const client = getFaunaClient();
    if (!client) return fallbackDb.providers;

    try {
      const result = await client.query(fql`
        Collection.byName("providers")?.documents()
          .map(doc => ({
            ref: { id: doc.id },
            data: doc.data
          })) ?? []
      `);
      return result.data;
    } catch (error) {
      return fallbackDb.providers;
    }
  },

  getInvoices: async () => {
    const client = getFaunaClient();
    if (!client) return fallbackDb.invoices;

    try {
      const result = await client.query(fql`
        Collection.byName("invoices")?.documents()
          .map(doc => ({
            ref: { id: doc.id },
            data: doc.data
          })) ?? []
      `);
      return result.data;
    } catch (error) {
      return fallbackDb.invoices;
    }
  },

  createInvoice: async (data: Omit<Invoice, 'id'>) => {
    const client = getFaunaClient();
    if (!client) return null;

    try {
      const result = await client.query(fql`
        Collection.byName("invoices")?.create({
          data: ${data}
        })
      `);
      return result.data;
    } catch (error) {
      return null;
    }
  },

  deleteInvoice: async (id: string) => {
    const client = getFaunaClient();
    if (!client) return null;

    try {
      await client.query(fql`
        Collection.byName("invoices")?.delete(${id})
      `);
      return { success: true };
    } catch (error) {
      return null;
    }
  }
};