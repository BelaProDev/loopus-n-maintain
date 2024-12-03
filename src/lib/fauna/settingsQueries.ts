import { query as q } from 'faunadb';
import { client } from './client';
import type { WhatsAppNumbers } from '@/types/dropbox';

export const settingsQueries = {
  getWhatsAppNumbers: async () => {
    try {
      const result = await client.query(
        q.Get(q.Match(q.Index('whatsapp_numbers_by_id'), '1'))
      );
      return result.data as WhatsAppNumbers;
    } catch (error) {
      console.error('Error fetching WhatsApp numbers:', error);
      return null;
    }
  },

  updateWhatsAppNumbers: async (numbers: WhatsAppNumbers) => {
    try {
      const result = await client.query(
        q.Update(
          q.Select(
            ['ref'],
            q.Get(q.Match(q.Index('whatsapp_numbers_by_id'), numbers.id))
          ),
          { data: numbers }
        )
      );
      return result.data as WhatsAppNumbers;
    } catch (error) {
      console.error('Error updating WhatsApp numbers:', error);
      return null;
    }
  }
};