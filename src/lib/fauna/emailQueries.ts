import { getFaunaClient } from './client';
import { fql } from 'fauna';
import type { EmailData } from './types';
import { fallbackQueries } from '../db/fallbackDb';

export const emailQueries = {
  getAllEmails: async () => {
    const client = getFaunaClient();
    if (!client) {
      return fallbackQueries.getAllEmails();
    }

    try {
      const query = fql`
        let emails = Collection.byName("emails")
        emails.all().map(email => {
          {
            ref: { id: email.id },
            data: email.data
          }
        })
      `;
      
      const response = await client.query(query);
      return response.data || [];
    } catch (error) {
      console.error('Fauna query error:', error);
      return fallbackQueries.getAllEmails();
    } finally {
      client.close();
    }
  },

  createEmail: async (data: EmailData) => {
    const client = getFaunaClient();
    if (!client) {
      return fallbackQueries.createEmail(data);
    }

    try {
      const timestamp = Date.now();
      const query = fql`
        let emails = Collection.byName("emails")
        let doc = emails.create({
          data: {
            email: ${data.email},
            name: ${data.name},
            type: ${data.type},
            password: ${data.password},
            createdAt: ${timestamp},
            updatedAt: ${timestamp}
          }
        })
        {
          ref: { id: doc.id },
          data: doc.data
        }
      `;
      
      const response = await client.query(query);
      return response.data;
    } catch (error) {
      console.error('Fauna create error:', error);
      return fallbackQueries.createEmail(data);
    } finally {
      client.close();
    }
  },

  updateEmail: async (id: string, data: Partial<EmailData>) => {
    const client = getFaunaClient();
    if (!client) {
      return fallbackQueries.updateEmail(id, data);
    }

    try {
      const query = fql`
        let emails = Collection.byName("emails")
        let doc = emails.byId(${id})
        if (doc != null) {
          let updated = doc.update({
            data: ${data}
          })
          {
            ref: { id: updated.id },
            data: updated.data
          }
        }
      `;
      
      const response = await client.query(query);
      return response.data || fallbackQueries.updateEmail(id, data);
    } catch (error) {
      console.error('Fauna update error:', error);
      return fallbackQueries.updateEmail(id, data);
    } finally {
      client.close();
    }
  },

  deleteEmail: async (id: string) => {
    const client = getFaunaClient();
    if (!client) {
      return fallbackQueries.deleteEmail(id);
    }

    try {
      const query = fql`
        let emails = Collection.byName("emails")
        let doc = emails.byId(${id})
        if (doc != null) {
          doc.delete()
          { success: true }
        }
      `;
      
      await client.query(query);
      return { success: true };
    } catch (error) {
      console.error('Fauna delete error:', error);
      return fallbackQueries.deleteEmail(id);
    } finally {
      client.close();
    }
  }
};