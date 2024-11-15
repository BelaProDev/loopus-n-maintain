import { getFaunaClient, handleFaunaError } from './client';
import { ContactMessage } from './types';
import { fql } from 'fauna';

export const contactQueries = {
  getAllMessages: async (service: ContactMessage['service']) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        Collection.byName(${service + "_messages"})!.documents()
        .map(message => {
          {
            id: message.id,
            name: message.data.name,
            email: message.data.email,
            message: message.data.message,
            service: message.data.service,
            status: message.data.status,
            createdAt: message.data.createdAt
          }
        })
      `);
      return result.data || [];
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
        collection.create({
          data: ${messageData}
        })
      `);
      
      return {
        id: result.data.id,
        ...messageData
      };
    } catch (error) {
      return handleFaunaError(error, null);
    }
  },

  updateMessageStatus: async (service: ContactMessage['service'], id: string, status: ContactMessage['status']) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        let doc = Collection.byName(${service + "_messages"})!
          .documents()
          .firstWhere(.id == ${id})!
        
        doc.update({
          data: {
            status: ${status}
          }
        })
      `);
      
      return {
        id: result.data.id,
        status,
        name: result.data.data.name,
        email: result.data.data.email,
        message: result.data.data.message,
        service: result.data.data.service,
        createdAt: result.data.data.createdAt
      };
    } catch (error) {
      return handleFaunaError(error, null);
    }
  }
};