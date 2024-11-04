import { getFaunaClient, handleFaunaError } from './client';
import { EmailData } from './types';
import { fql } from 'fauna';
import { SHA256 } from 'crypto-js';
import { fallbackQueries } from '../db/fallbackDb';

export const emailQueries = {
  getAllEmails: async () => {
    const client = getFaunaClient();
    if (!client) {
      return fallbackQueries.getAllEmails();
    }

    try {
      const result = await client.query(fql`
        Collection.byName("emails")?.documents()
          .map(doc => ({
            ref: { id: doc.id },
            data: doc.data
          })) ?? []
      `);
      return result.data;
    } catch (error) {
      return fallbackQueries.getAllEmails();
    }
  },

  createEmail: async (data: EmailData) => {
    const client = getFaunaClient();
    if (!client) {
      return fallbackQueries.createEmail(data);
    }

    try {
      const timestamp = Date.now();
      const hashedPassword = data.password ? SHA256(data.password).toString() : undefined;
      
      const result = await client.query(fql`
        let doc = Collection.byName("emails").create({
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
      return fallbackQueries.createEmail(data);
    }
  },

  updateEmail: async (id: string, data: Partial<EmailData>) => {
    const client = getFaunaClient();
    if (!client) {
      return fallbackQueries.updateEmail(id, data);
    }

    try {
      const result = await client.query(fql`
        let doc = Collection.byName("emails").document(${id})
        let updated = doc.update({
          data: ${data},
          updatedAt: Time.now()
        })
        {
          ref: { id: updated.id },
          data: updated.data
        }
      `);
      return result;
    } catch (error) {
      return fallbackQueries.updateEmail(id, data);
    }
  },

  deleteEmail: async (id: string) => {
    const client = getFaunaClient();
    if (!client) {
      return fallbackQueries.deleteEmail(id);
    }

    try {
      await client.query(fql`
        Collection.byName("emails").document(${id}).delete()
      `);
      return { success: true };
    } catch (error) {
      return fallbackQueries.deleteEmail(id);
    }
  }
};