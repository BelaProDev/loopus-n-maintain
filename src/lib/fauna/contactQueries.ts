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
      const result = await client.query(
        fql`
          let coll = Collection.byName(${JSON.stringify(collectionName)})!
          let docs = coll.all().documents()
          docs
        `
      );
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
      const result = await client.query(
        fql`
          let coll = Collection.byName(${JSON.stringify(collectionName)})!
          let doc = coll.create({ data: ${JSON.stringify(messageData)} })
          doc
        `
      );
      
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
      const result = await client.query(
        fql`
          let coll = Collection.byName(${JSON.stringify(collectionName)})!
          let doc = coll.document(${JSON.stringify(id)})!
          let updated = doc.update({ data: { status: ${JSON.stringify(status)} } })
          updated
        `
      );
      
      const document = extractFaunaData(result)[0];
      return document ? { id: document.ref.id, ...document.data } : null;
    } catch (error) {
      return handleFaunaError(error, null);
    }
  }
};