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
        let collection = Collection.byName("emails")!
        collection.all().map(doc => {
          {
            id: doc.id,
            data: {
              email: doc.data.email,
              name: doc.data.name,
              type: doc.data.type
            }
          }
        })
      `;
      
      const response = await client.query(query);
      return response.data.map((doc: any) => ({
        ref: { id: doc.id },
        data: {
          email: doc.data.email,
          name: doc.data.name,
          type: doc.data.type
        }
      }));
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
      const query = fql`
        let collection = Collection.byName("emails")!
        collection.create({
          data: {
            email: ${data.email},
            name: ${data.name},
            type: ${data.type},
            password: ${data.password},
            createdAt: ${timestamp},
            updatedAt: ${timestamp}
          }
        })
      `;
      
      const response = await client.query(query);
      return {
        ref: { id: response.data.id },
        data: {
          email: response.data.data.email,
          name: response.data.data.name,
          type: response.data.data.type
        }
      };
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
      const query = fql`
        let collection = Collection.byName("emails")!
        let doc = collection.where(.id == ${id}).first()
        doc.update({
          data: ${data}
        })
      `;
      
      const response = await client.query(query);
      if (!response.data) {
        throw new Error('Email not found');
      }
      
      return {
        ref: { id: response.data.id },
        data: {
          email: response.data.data.email,
          name: response.data.data.name,
          type: response.data.data.type
        }
      };
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
      const query = fql`
        let collection = Collection.byName("emails")!
        let doc = collection.where(.id == ${id}).first()
        doc.delete()
      `;
      
      await client.query(query);
      return { success: true };
    } catch (error) {
      console.error('Fauna delete error:', error);
      return fallbackQueries.deleteEmail(id);
    }
  }
};