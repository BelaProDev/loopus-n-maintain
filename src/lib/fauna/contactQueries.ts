import { getFaunaClient } from './client';
import { ContactMessage } from './types';
import { fql } from 'fauna';
import { extractFaunaData, FaunaDocument } from './utils';

export const contactQueries = {
  getAllMessages: async (service: ContactMessage['service']) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const query = fql`
        messages.where(.service == ${service})
      `;
      const result = await client.query(query);
      return extractFaunaData<ContactMessage>(result);
    } catch (error) {
      return [];
    }
  },

  createMessage: async (data: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const messageData = {
        service: data.service,
        name: data.name,
        email: data.email,
        message: data.message,
        status: 'new' as const,
        createdAt: new Date().toISOString()
      };

      const query = fql`
        messages.create({
          service: ${messageData.service},
          name: ${messageData.name},
          email: ${messageData.email},
          message: ${messageData.message},
          status: ${messageData.status},
          createdAt: ${messageData.createdAt}
        })
      `;
      const result = await client.query(query);
      const document = extractFaunaData<ContactMessage>(result)[0];
      return document ? { id: document.ref.id, ...document.data } : null;
    } catch (error) {
      return null;
    }
  },

  updateMessageStatus: async (service: ContactMessage['service'], id: string, status: ContactMessage['status']) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const query = fql`
        messages.byId(${JSON.stringify(id)}).update({ status: ${JSON.stringify(status)} })
      `;
      const result = await client.query(query);
      const document = extractFaunaData<ContactMessage>(result)[0];
      return document ? { id: document.ref.id, ...document.data } : null;
    } catch (error) {
      return null;
    }
  }
};