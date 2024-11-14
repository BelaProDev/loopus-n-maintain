import { getFaunaClient } from './client';
import { fql } from 'fauna';
import type { Client, Provider, Invoice } from '@/types/business';
import { fallbackQueries } from '../db/fallbackDb';

export const businessQueries = {
  getClients: async () => {
    const client = getFaunaClient();
    if (!client) return fallbackQueries.clients;

    try {
      const query = fql`
        Client.all()
      `;
      const result = await client.query(query);
      return result.data.map((doc: any) => ({
        id: doc.id,
        ...doc.data
      }));
    } catch (error) {
      console.error('Fauna query error:', error);
      return fallbackQueries.clients;
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
      const query = fql`
        Client.create({
          data: ${clientData}
        })
      `;
      const result = await client.query(query);
      return {
        id: result.data.id,
        ...result.data.data
      };
    } catch (error) {
      console.error('Fauna create error:', error);
      return null;
    }
  },

  getProviders: async () => {
    const client = getFaunaClient();
    if (!client) return fallbackQueries.providers;

    try {
      const query = fql`
        Provider.all()
      `;
      const result = await client.query(query);
      return result.data.map((doc: any) => ({
        id: doc.id,
        ...doc.data
      }));
    } catch (error) {
      console.error('Fauna query error:', error);
      return fallbackQueries.providers;
    }
  },

  getInvoices: async () => {
    const client = getFaunaClient();
    if (!client) return fallbackQueries.invoices;

    try {
      const query = fql`
        Invoice.all()
      `;
      const result = await client.query(query);
      return result.data.map((doc: any) => ({
        id: doc.id,
        ...doc.data
      }));
    } catch (error) {
      console.error('Fauna query error:', error);
      return fallbackQueries.invoices;
    }
  },

  createInvoice: async (data: Omit<Invoice, 'id'>) => {
    const client = getFaunaClient();
    if (!client) return null;

    try {
      const query = fql`
        Invoice.create({
          data: ${data}
        })
      `;
      const result = await client.query(query);
      return {
        id: result.data.id,
        ...result.data.data
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
      const query = fql`
        Invoice.byId(${id})?.delete()
      `;
      await client.query(query);
      return { success: true };
    } catch (error) {
      console.error('Fauna delete error:', error);
      return null;
    }
  }
};