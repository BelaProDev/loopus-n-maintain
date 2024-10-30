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
        let emails = Collection.byName("emails")!
        emails.all().documents().map(doc => {
          {
            ref: { id: doc.id },
            data: doc.data
          }
        })
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
        let emails = Collection.byName("emails")!
        let doc = emails.create({
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
      return handleFaunaError(error, { data });
    }
  },

  updateEmail: async (id: string, data: Partial<EmailData>) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        let emails = Collection.byName("emails")!
        let doc = emails.firstWhere(.id == ${id})
        if (doc == null) {
          abort("Document not found")
        }
        doc.update({ 
          data: ${data},
          updatedAt: Time.now()
        })
      `);
      return result;
    } catch (error) {
      return handleFaunaError(error, { id, data });
    }
  },

  deleteEmail: async (id: string) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      await client.query(fql`
        let emails = Collection.byName("emails")!
        let doc = emails.firstWhere(.id == ${id})
        if (doc == null) {
          abort("Document not found")
        }
        doc.delete()
      `);
      return { success: true };
    } catch (error) {
      return handleFaunaError(error, { success: false });
    }
  }
};