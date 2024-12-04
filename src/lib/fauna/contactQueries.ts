import { getFaunaClient } from './client';
import { ContactMessage } from './types';
import { fql } from 'fauna';
import { extractFaunaData, type FaunaDocument } from './utils';

export const contactQueries = {
  getAllMessages: async (service: ContactMessage['service']): Promise<ContactMessage[]> => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const query = fql`
        contact_messages.where(.service == ${service})
      `;
      const result = await client.query(query);
      return extractFaunaData<ContactMessage>(result);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  createMessage: async (data: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<ContactMessage | null> => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const messageData = {
        ...data,
        status: 'new' as const,
        createdAt: new Date().toISOString()
      };

      const query = fql`
        contact_messages.create(${messageData})
      `;
      const result = await client.query(query);
      const messages = extractFaunaData<ContactMessage>(result);
      return messages[0] || null;
    } catch (error) {
      console.error('Error creating message:', error);
      return null;
    }
  },

  updateMessageStatus: async (id: string, status: ContactMessage['status']): Promise<ContactMessage | null> => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const query = fql`
        contact_messages.byId(${id}).update({ status: ${status} })
      `;
      const result = await client.query(query);
      const messages = extractFaunaData<ContactMessage>(result);
      return messages[0] || null;
    } catch (error) {
      console.error('Error updating message status:', error);
      return null;
    }
  }
};