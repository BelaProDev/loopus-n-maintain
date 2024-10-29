import { getFaunaClient, handleFaunaError, sanitizeForFauna } from './utils';
import { fql } from 'fauna';
import fallbackDb from '../fallback-db.json';
import { SHA256 } from 'crypto-js';

export interface EmailData {
  email: string;
  name: string;
  type: string;
  password?: string;
  createdAt?: number;
  updatedAt?: number;
}

export const emailQueries = {
  getAllEmails: async () => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        Collection.byName("emails").all().map(doc => {
          {
            id: doc.id,
            ts: doc.ts,
            email: doc.data.email,
            name: doc.data.name,
            type: doc.data.type
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
        email: data.email,
        name: data.name,
        type: data.type,
        password: hashedPassword,
        createdAt: timestamp,
        updatedAt: timestamp
      });
      
      return await client.query(fql`
        Collection.byName("emails").create(${sanitizedData})
      `);
    } catch (error) {
      return handleFaunaError(error, {
        id: `fallback-${Date.now()}`,
        ...data,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
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
      return handleFaunaError(error, { id, ...data });
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