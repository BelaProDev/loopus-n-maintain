import { getFaunaClient } from './client';
import { ContactMessage } from './types';
import { fql } from 'fauna';
import { extractFaunaData } from './utils';

export const contactQueries = {
  getAllMessages: async (service: ContactMessage['service']): Promise<ContactMessage[]> => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const query = fql`
        let messages = contact_messages.where(.service == ${service})
        messages {
          id: messages.id,
          service: messages.service,
          name: messages.name,
          email: messages.email,
          message: messages.message,
          status: messages.status,
          createdAt: messages.createdAt
        }
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
        let message = contact_messages.create(${messageData})
        {
          id: message.id,
          service: message.service,
          name: message.name,
          email: message.email,
          message: message.message,
          status: message.status,
          createdAt: message.createdAt
        }
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
        let message = contact_messages.byId(${id}).update({ status: ${status} })
        {
          id: message.id,
          service: message.service,
          name: message.name,
          email: message.email,
          message: message.message,
          status: message.status,
          createdAt: message.createdAt
        }
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