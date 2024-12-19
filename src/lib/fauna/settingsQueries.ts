import { Client } from 'faunadb';
import type { WhatsAppNumbers } from '@/types/dropbox';
import { settingsQueries as fallbackQueries } from '../db/settingsDb';

export const settingsQueries = {
  getWhatsAppNumbers: async () => {
    try {
      const client = new Client({
        secret: import.meta.env.VITE_FAUNA_SECRET_KEY || '',
        domain: 'db.fauna.com'
      });
      
      const result = await client.query<{ data: WhatsAppNumbers }>({
        collection: 'settings',
        index: 'whatsapp_numbers_by_id',
        id: '1'
      });
      return result.data;
    } catch (error) {
      console.warn('Falling back to local settings:', error);
      return fallbackQueries.getWhatsAppNumbers();
    }
  },

  updateWhatsAppNumbers: async (numbers: WhatsAppNumbers) => {
    try {
      const client = new Client({
        secret: import.meta.env.VITE_FAUNA_SECRET_KEY || '',
        domain: 'db.fauna.com'
      });
      
      const result = await client.query<{ data: WhatsAppNumbers }>({
        collection: 'settings',
        action: 'update',
        id: '1',
        data: numbers
      });
      return result.data;
    } catch (error) {
      console.warn('Falling back to local settings:', error);
      return fallbackQueries.updateWhatsAppNumbers(numbers);
    }
  },

  getLogo: async () => {
    try {
      const client = new Client({
        secret: import.meta.env.VITE_FAUNA_SECRET_KEY || '',
        domain: 'db.fauna.com'
      });
      
      const result = await client.query<{ data: { logo: string } }>({
        collection: 'site_settings',
        index: 'by_key',
        terms: 'logo'
      });
      return result.data.logo;
    } catch (error) {
      console.warn('Falling back to local settings:', error);
      return null;
    }
  },

  updateLogo: async (base64String: string) => {
    try {
      const client = new Client({
        secret: import.meta.env.VITE_FAUNA_SECRET_KEY || '',
        domain: 'db.fauna.com'
      });
      
      const result = await client.query<{ data: { logo: string } }>({
        collection: 'site_settings',
        action: 'update',
        data: { logo: base64String }
      });
      return result.data.logo;
    } catch (error) {
      console.warn('Falling back to local settings:', error);
      return null;
    }
  }
};