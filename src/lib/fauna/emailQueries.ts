import { getFaunaClient, handleFaunaError } from './client';
import { EmailData } from './types';
import { fql } from 'fauna';
import { SHA256 } from 'crypto-js';
import fallbackDb from '../fallback-db.json';

export const emailQueries = {
  getAllEmails: async () => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        let collection = Collection.byName("emails")!
        collection!.documents().map(
          doc => {
            {
              ref: { id: doc.id },
              data: doc.data
            }
          }
        )
      `);
      return result.data;
    } catch (error) {
      return handleFaunaError(error, fallbackDb.emails);
    }
  },

  createEmail: async (data: EmailData) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const timestamp = Date.now();
      const hashedPassword = data.password ? SHA256(data.password).toString() : undefined;
      
      const result = await client.query(fql`
        let collection = Collection.byName("emails")!
        let doc = collection!.create({
          data: {
            email: ${data.email},
            name: ${data.name},
            type: ${data.type},
            password: ${hashedPassword},
            createdAt: ${timestamp},
            updatedAt: ${timestamp}
          }
        })
        {
          ref: { id: doc.id },
          data: doc.data
        }
      `);
      return result;
    } catch (error) {
      return handleFaunaError(error, null);
    }
  },

  updateEmail: async (id: string, data: Partial<EmailData>) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const updateData = {
        ...data,
        password: data.password ? SHA256(data.password).toString() : undefined,
        updatedAt: Date.now()
      };
      
      const result = await client.query(fql`
        let collection = Collection.byName("emails")!
        let doc = collection!.firstWhere(.id == ${id})!
        let updated = doc.update({ data: ${updateData} })
        {
          ref: { id: updated.id },
          data: updated.data
        }
      `);
      return result;
    } catch (error) {
      return handleFaunaError(error, null);
    }
  },

  deleteEmail: async (id: string) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      await client.query(fql`
        let collection = Collection.byName("emails")!
        let doc = collection!.firstWhere(.id == ${id})!
        doc.delete()
      `);
      return { success: true };
    } catch (error) {
      return handleFaunaError(error, { success: false });
    }
  }
};