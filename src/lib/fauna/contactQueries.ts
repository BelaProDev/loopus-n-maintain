import { getFaunaClient, handleFaunaError } from './client';
import { ContactMessage } from './types';
import { Client, fql } from 'fauna';
import { extractFaunaData } from './utils';

export const contactQueries = {
  getAllMessages: async (service: ContactMessage['service']) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const collectionName = `${service}_messages`;
      const query = fql`
        Collection.byName("${collectionName}")!
        .all()
        .documents()
      `;
      const result = await client.query(query);
      return extractFaunaData(result);
    } catch (error) {
      return handleFaunaError(error, []);
    }
  },

  createMessage: async (data: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const messageData = {
        name: data.name,
        email: data.email,
        message: data.message,
        service: data.service,
        status: 'new',
        createdAt: new Date().toISOString()
      };

      const collectionName = `${data.service}_messages`;
      const query = fql`
        Collection.byName("${collectionName}")!
        .create({
          data: ${JSON.stringify(messageData)}
        })
      `;
      
      const result = await client.query(query);
      const document = extractFaunaData(result)[0];
      return document ? { id: document.ref.id, ...document.data } : null;
    } catch (error) {
      return handleFaunaError(error, null);
    }
  },

  updateMessageStatus: async (service: ContactMessage['service'], id: string, status: ContactMessage['status']) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const collectionName = `${service}_messages`;
      const query = fql`
        Collection.byName("${collectionName}")!
        .document("${id}")!
        .update({
          data: {
            status: "${status}"
          }
        })
      `;
      
      const result = await client.query(query);
      const document = extractFaunaData(result)[0];
      return document ? { id: document.ref.id, ...document.data } : null;
    } catch (error) {
      return handleFaunaError(error, null);
    }
  }
};