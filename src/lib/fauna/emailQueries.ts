import { getFaunaClient, handleFaunaError, sanitizeForFauna } from './utils';
import { fql } from 'fauna';
import { SHA256 } from 'crypto-js';
import fallbackDb from '../fallback-db.json';

export interface EmailData {
  email: string;
  name: string;
  type: string;
  password?: string;
}

export const emailQueries = {
  getAllEmails: async () => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        Collection.byName("emails").all().map(doc => {
          {
            ref: { id: doc.id },
            data: {
              email: doc.data.email,
              name: doc.data.name,
              type: doc.data.type
            }
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
      
      const sanitizedData = sanitizeForFauna({
        ...data,
        password: hashedPassword,
        createdAt: timestamp,
        updatedAt: timestamp
      });
      
      return await client.query(fql`
        Collection.byName("emails").create(${sanitizedData})
      `);
    } catch (error) {
      return handleFaunaError(error, null);
    }
  },

  updateEmail: async (id: string, data: Partial<EmailData>) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const sanitizedData = sanitizeForFauna({
        ...data,
        password: data.password ? SHA256(data.password).toString() : undefined,
        updatedAt: Date.now()
      });
      
      return await client.query(fql`
        let doc = Collection.byName("emails").where(.id == ${id}).first()
        doc.update(${sanitizedData})
      `);
    } catch (error) {
      return handleFaunaError(error, null);
    }
  },

  deleteEmail: async (id: string) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      return await client.query(fql`
        let doc = Collection.byName("emails").where(.id == ${id}).first()
        doc.delete()
      `);
    } catch (error) {
      return handleFaunaError(error, { success: true });
    }
  }
};