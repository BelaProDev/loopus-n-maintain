import { getFaunaClient, handleFaunaError } from './client';
import { EmailData } from './types';
import { fql } from 'fauna';
import { fallbackQueries } from '../db/fallbackDb';

export const emailQueries = {
  getAllEmails: async () => {
    const client = getFaunaClient();
    if (!client) {
      return fallbackQueries.getAllEmails();
    }

    try {
      const result = await client.query(fql`
        let collection = Collection.byName("emails")
        if (collection != null) {
          collection.documents().map(doc => ({
            ref: { id: doc.id },
            data: doc.data
          }))
        } else {
          []
        }
      `);
      return result.data || [];
    } catch (error) {
      console.error('Fauna query error:', error);
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
      const result = await client.query(fql`
        let collection = Collection.byName("emails")
        if (collection != null) {
          let doc = collection.create({
            data: {
              email: ${data.email},
              name: ${data.name},
              type: ${data.type},
              createdAt: ${timestamp}
            }
          })
          {
            ref: { id: doc.id },
            data: doc.data
          }
        }
      `);
      return result || fallbackQueries.createEmail(data);
    } catch (error) {
      console.error('Fauna create error:', error);
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
        let collection = Collection.byName("emails")
        if (collection != null) {
          let doc = collection.document(${id})
          if (doc != null) {
            let updated = doc.update({
              data: ${data}
            })
            {
              ref: { id: updated.id },
              data: updated.data
            }
          }
        }
      `);
      return result || fallbackQueries.updateEmail(id, data);
    } catch (error) {
      console.error('Fauna update error:', error);
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
        let collection = Collection.byName("emails")
        if (collection != null) {
          let doc = collection.document(${id})
          if (doc != null) {
            doc.delete()
          }
        }
      `);
      return { success: true };
    } catch (error) {
      console.error('Fauna delete error:', error);
      return fallbackQueries.deleteEmail(id);
    }
  }
};