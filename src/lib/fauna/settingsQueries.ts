import { getFaunaClient } from './client';
import { query as q } from 'faunadb';
import type { WhatsAppNumbers } from '@/types/business';
import { settingsQueries as fallbackQueries } from '../db/settingsDb';

export const settingsQueries = {
  getWhatsAppNumbers: async () => {
    try {
      const client = getFaunaClient();
      const result = await client.query<{ data: WhatsAppNumbers }>(
        q.Get(q.Match(q.Index('settings_by_key'), 'whatsapp_numbers'))
      );
      return result.data || fallbackQueries.getWhatsAppNumbers();
    } catch (error) {
      console.warn('Falling back to local settings:', error);
      return fallbackQueries.getWhatsAppNumbers();
    }
  },

  updateWhatsAppNumbers: async (numbers: WhatsAppNumbers) => {
    try {
      const client = getFaunaClient();
      const result = await client.query<{ data: WhatsAppNumbers }>(
        q.Update(
          q.Select('ref', q.Get(q.Match(q.Index('settings_by_key'), 'whatsapp_numbers'))),
          { data: numbers }
        )
      );
      return result.data;
    } catch (error) {
      console.warn('Falling back to local settings:', error);
      return fallbackQueries.updateWhatsAppNumbers(numbers);
    }
  },

  getLogo: async () => {
    try {
      const client = getFaunaClient();
      const result = await client.query<{ data: { logo: string } }>(
        q.Get(q.Match(q.Index('settings_by_key'), 'logo'))
      );
      return result.data.logo || null;
    } catch (error) {
      console.warn('Falling back to local settings:', error);
      return null;
    }
  },

  updateLogo: async (base64String: string) => {
    try {
      const client = getFaunaClient();
      const result = await client.query<{ data: { logo: string } }>(
        q.Update(
          q.Select('ref', q.Get(q.Match(q.Index('settings_by_key'), 'logo'))),
          { data: { logo: base64String } }
        )
      );
      return result.data.logo;
    } catch (error) {
      console.warn('Falling back to local settings:', error);
      return null;
    }
  }
};