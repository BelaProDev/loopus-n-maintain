import { getFaunaClient } from './client';
import { fql } from 'fauna';
import type { EmailData } from './types';
import { fallbackQueries } from '../db/fallbackDb';
import { extractFaunaData } from './utils';

export const emailQueries = {
  getAllEmails: async () => {
    const client = getFaunaClient();
    if (!client) {
      return fallbackQueries.getAllEmails();
    }

    try {
      const query = fql`
        Email.all()
      `;
      const result = await client.query(query);
      return extractFaunaData(result);
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
        Email.create({
          data: {
            email: ${data.email},
            name: ${data.name},
            type: ${data.type},
            password: ${data.password},
            createdAt: Time(${timestamp}),
            updatedAt: Time(${timestamp})
          }
        })
      `;
      
      const result = await client.query(query);
      return extractFaunaData(result)[0];
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
        Email.byId(${id}).update({
          data: ${data}
        })
      `;
      
      const result = await client.query(query);
      if (!result) {
        throw new Error('Email not found');
      }
      
      return extractFaunaData(result)[0];
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
        Email.byId(${id}).delete()
      `;
      
      await client.query(query);
      return { success: true };
    } catch (error) {
      console.error('Fauna delete error:', error);
      return fallbackQueries.deleteEmail(id);
    }
  }
};