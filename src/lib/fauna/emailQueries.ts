import { getFaunaClient } from './client';
import { Collection } from 'fauna';
import type { EmailData } from './types';
import { fallbackQueries } from '../db/fallbackDb';

export const emailQueries = {
  getAllEmails: async () => {
    const client = getFaunaClient();
    if (!client) {
      return fallbackQueries.getAllEmails();
    }

    try {
      const emails = await client.query(
        Collection.all('emails')
      );
      
      return emails.data.map((doc: any) => ({
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
      const emailData = {
        email: data.email,
        name: data.name,
        type: data.type,
        password: data.password,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      const response = await client.query(
        Collection.create('emails', emailData)
      );

      return {
        ref: { id: response.id },
        data: {
          email: response.data.email,
          name: response.data.name,
          type: response.data.type
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
      const response = await client.query(
        Collection.update('emails', id, { data })
      );

      if (!response) {
        throw new Error('Email not found');
      }
      
      return {
        ref: { id: response.id },
        data: {
          email: response.data.email,
          name: response.data.name,
          type: response.data.type
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
      await client.query(
        Collection.delete('emails', id)
      );
      return { success: true };
    } catch (error) {
      console.error('Fauna delete error:', error);
      return fallbackQueries.deleteEmail(id);
    }
  }
};