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
        let docs = Collection.byName("emails").all()
        {
          data: docs.map(doc => {
            {
              ref: { id: doc.id },
              data: {
                email: doc.data.email,
                name: doc.data.name,
                type: doc.data.type
              }
            }
          })
        }
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
      
      const sanitizedData = {
        data: {
          email: data.email,
          name: data.name,
          type: data.type,
          password: hashedPassword,
          createdAt: timestamp,
          updatedAt: timestamp
        }
      };
      
      const result = await client.query(fql`
        let doc = Collection.byName("emails").create(${sanitizedData})
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
      const sanitizedData = {
        data: {
          ...data,
          password: data.password ? SHA256(data.password).toString() : undefined,
          updatedAt: Date.now()
        }
      };
      
      const result = await client.query(fql`
        let doc = Collection.byName("emails").where(.id == ${id}).first()
        let updated = doc.update(${sanitizedData})
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
      return await client.query(fql`
        let doc = Collection.byName("emails").where(.id == ${id}).first()
        doc.delete()
      `);
    } catch (error) {
      return handleFaunaError(error, { success: true });
    }
  }
};