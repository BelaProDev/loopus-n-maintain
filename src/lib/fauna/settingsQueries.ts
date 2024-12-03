import { query as q } from 'faunadb';
import { client } from './client';
import type { WhatsAppNumbers } from '@/types/dropbox';

export const settingsQueries = {
  getWhatsAppNumbers: async () => {
    try {
      const result = await client.query<{ data: WhatsAppNumbers }>(
        q.Get(q.Match(q.Index('whatsapp_numbers_by_id'), '1'))
      );
      return result.data;
    } catch (error) {
      console.error('Error fetching WhatsApp numbers:', error);
      return null;
    }
  },

  updateWhatsAppNumbers: async (numbers: WhatsAppNumbers) => {
    try {
      const result = await client.query<{ data: WhatsAppNumbers }>(
        q.Update(
          q.Select(
            ['ref'],
            q.Get(q.Match(q.Index('whatsapp_numbers_by_id'), '1'))
          ),
          { data: numbers }
        )
      );
      return result.data;
    } catch (error) {
      console.error('Error updating WhatsApp numbers:', error);
      return null;
    }
  },

  getLogo: async () => {
    try {
      const result = await client.query<{ data: { logo: string } }>(
        q.Get(q.Match(q.Index('site_settings_by_key'), 'logo'))
      );
      return result.data.logo;
    } catch (error) {
      console.error('Error fetching logo:', error);
      return null;
    }
  },

  updateLogo: async (base64String: string) => {
    try {
      const result = await client.query<{ data: { logo: string } }>(
        q.Update(
          q.Select(
            ['ref'],
            q.Get(q.Match(q.Index('site_settings_by_key'), 'logo'))
          ),
          { data: { logo: base64String } }
        )
      );
      return result.data.logo;
    } catch (error) {
      console.error('Error updating logo:', error);
      return null;
    }
  }
};