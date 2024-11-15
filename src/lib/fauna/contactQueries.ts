import { getFaunaClient, handleFaunaError } from './client';
import { ContactMessage } from './types';
import { fql } from 'fauna';

export const contactQueries = {
  getAllMessages: async (service: ContactMessage['service']) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        let collection = Collection.byName(${service + "_messages"})!
        collection!.documents().map(doc => doc.data)
      `);
      return result.data;
    } catch (error) {
      return handleFaunaError(error, []);
    }
  },

  createMessage: async (data: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const messageData = {
        ...data,
        status: 'new',
        createdAt: new Date().toISOString()
      };

      const result = await client.query(fql`
        let collection = Collection.byName(${data.service + "_messages"})!
        collection!.create({ data: ${messageData} })
      `);
      return result;
    } catch (error) {
      return handleFaunaError(error, null);
    }
  },

  updateMessageStatus: async (service: ContactMessage['service'], id: string, status: ContactMessage['status']) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        let collection = Collection.byName(${service + "_messages"})!
        let doc = collection!.firstWhere(.id == ${id})
        doc.update({ data: { status: ${status} } })
      `);
      return result;
    } catch (error) {
      return handleFaunaError(error, null);
    }
  }
};