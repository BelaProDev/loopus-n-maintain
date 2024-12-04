import { getFaunaClient } from '../client';
import { fql } from 'fauna';
import type { Client } from '@/types/business';
import { extractFaunaData } from '../utils';

export const clientQueries = {
  getClients: async (): Promise<Client[]> => {
    const client = getFaunaClient();
    if (!client) return [];
    try {
      const query = fql`
        let clients = clients.all()
        clients {
          id: clients.id,
          name: clients.name,
          email: clients.email,
          phone: clients.phone,
          company: clients.company,
          vatNumber: clients.vatNumber,
          status: clients.status,
          totalInvoices: clients.totalInvoices || 0,
          totalAmount: clients.totalAmount || 0
        }
      `;
      const result = await client.query(query);
      return extractFaunaData<Client>(result);
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  },

  createClient: async (data: Omit<Client, 'id' | 'totalInvoices' | 'totalAmount' | 'status'>) => {
    const client = getFaunaClient();
    if (!client) return null;
    try {
      const query = fql`
        let newClient = clients.create({
          name: ${data.name},
          email: ${data.email},
          phone: ${data.phone},
          company: ${data.company},
          vatNumber: ${data.vatNumber},
          status: "active",
          totalInvoices: 0,
          totalAmount: 0
        })
        {
          id: newClient.id,
          name: newClient.name,
          email: newClient.email,
          phone: newClient.phone,
          company: newClient.company,
          vatNumber: newClient.vatNumber,
          status: newClient.status,
          totalInvoices: newClient.totalInvoices,
          totalAmount: newClient.totalAmount
        }
      `;
      const result = await client.query(query);
      const documents = extractFaunaData<Client>(result);
      return documents[0] || null;
    } catch (error) {
      console.error('Error creating client:', error);
      return null;
    }
  }
};