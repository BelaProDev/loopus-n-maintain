import { getFaunaClient, handleFaunaError } from './client';
import { fql } from 'fauna';
import fallbackDb from '../fallback-db.json';

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
  }
};