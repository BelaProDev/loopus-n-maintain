import { getFaunaClient, handleFaunaError } from './client';
import { fql } from 'fauna';
import type { QueryArgument } from 'fauna';
import fallbackDb from '../fallback-db.json';
import { Client, Provider, Invoice } from '@/types/business';

type FaunaData<T> = {
  data: T;
  ref: { id: string };
};

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

  createClient: async (data: Omit<Client, 'id' | 'totalInvoices' | 'totalAmount' | 'status'>) => {
    const client = getFaunaClient();
    if (!client) return null;

    const clientData = {
      ...data,
      totalInvoices: 0,
      totalAmount: 0,
      status: 'active'
    };

    try {
      const result = await client.query(fql`
        Collection.byName("clients")?.create({
          data: ${clientData as QueryArgument}
        })
      `);
      return result.data;
    } catch (error) {
      return null;
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

    // Convert invoice items to plain objects for Fauna
    const invoiceData = {
      ...data,
      items: data.items.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total
      }))
    };

    try {
      const result = await client.query(fql`
        Collection.byName("invoices")?.create({
          data: ${invoiceData as QueryArgument}
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