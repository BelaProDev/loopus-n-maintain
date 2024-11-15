import { getFaunaClient } from './client';
import { ContactMessage } from './types';
import { fql } from 'fauna';
import { extractFaunaData } from './utils';

export const contactQueries = {
  getAllMessages: async (service: ContactMessage['service']) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      // Construct the collection name as a single string
      const collectionName = `${service}_messages`;
      const result = await client.query(
        fql`${collectionName}.all()`
      );
      return extractFaunaData(result);
    } catch (error) {
      return [];
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
        status: 'new',
        createdAt: new Date().toISOString()
      };

      // Construct the collection name as a single string
      const collectionName = `${data.service}_messages`;
      const result = await client.query(
        fql`${collectionName}.create(${JSON.stringify(messageData)})`
      );
      
      const document = extractFaunaData(result)[0];
      return document ? { id: document.ref.id, ...document.data } : null;
    } catch (error) {
      return null;
    }
  },

  updateMessageStatus: async (service: ContactMessage['service'], id: string, status: ContactMessage['status']) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      // Construct the collection name as a single string
      const collectionName = `${service}_messages`;
      const result = await client.query(
        fql`${collectionName}.byId(${JSON.stringify(id)}).update({ status: ${JSON.stringify(status)} })`
      );
      
      const document = extractFaunaData(result)[0];
      return document ? { id: document.ref.id, ...document.data } : null;
    } catch (error) {
      return null;
    }
  }
};