import { client } from '../client';
import { fql } from 'fauna';
import type { Client } from '@/types/business';
import { extractFaunaData, type FaunaDocument } from '../utils';

export const clientQueries = {
  getClients: async (): Promise<Client[]> => {
    try {
      const query = fql`clients.all()`;
      const result = await client.query(query);
      const documents = extractFaunaData<Client>(result);
      return documents.map(doc => ({
        id: doc.ref.id,
        ...doc.data
      }));
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  },

  createClient: async (data: Omit<Client, 'id' | 'totalInvoices' | 'totalAmount' | 'status'>) => {
    try {
      const query = fql`
        clients.create({
          name: ${data.name},
          email: ${data.email},
          phone: ${data.phone},
          company: ${data.company},
          vatNumber: ${data.vatNumber},
          status: "active"
        })
      `;
      const result = await client.query(query);
      const document = extractFaunaData<Client>(result)[0];
      return document ? {
        id: document.ref.id,
        ...document.data
      } : null;
    } catch (error) {
      return null;
    }
  }
};