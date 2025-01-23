import { getFaunaClient } from './client';
import { fql } from 'fauna';
import type { WhatsAppNumbers } from '@/types/business';
import { settingsQueries as fallbackQueries } from '../db/settingsDb';

export const settingsQueries = {
  getWhatsAppNumbers: async () => {
    try {
      const client = getFaunaClient();
      const result = await client.query(fql`
        let doc = settings.firstWhere(.key == "whatsapp_numbers")
        { data: doc.data }
      `);
      return result.data as WhatsAppNumbers || fallbackQueries.getWhatsAppNumbers();
    } catch (error) {
      console.warn('Falling back to local settings:', error);
      return fallbackQueries.getWhatsAppNumbers();
    }
  },

  updateWhatsAppNumbers: async (numbers: WhatsAppNumbers) => {
    try {
      const client = getFaunaClient();
      const result = await client.query(fql`
        let doc = settings.firstWhere(.key == "whatsapp_numbers")
        doc.update({ data: ${numbers} })
        { data: doc.data }
      `);
      return result.data as WhatsAppNumbers;
    } catch (error) {
      console.warn('Falling back to local settings:', error);
      return fallbackQueries.updateWhatsAppNumbers(numbers);
    }
  },

  getLogo: async () => {
    try {
      const client = getFaunaClient();
      const result = await client.query(fql`
        let doc = settings.firstWhere(.key == "logo")
        { data: { logo: doc.data.logo } }
      `);
      return (result.data as { logo: string }).logo || null;
    } catch (error) {
      console.warn('Falling back to local settings:', error);
      return null;
    }
  },

  updateLogo: async (base64String: string) => {
    try {
      const client = getFaunaClient();
      const result = await client.query(fql`
        let doc = settings.firstWhere(.key == "logo")
        doc.update({ data: { logo: ${base64String} } })
        { data: { logo: doc.data.logo } }
      `);
      return (result.data as { logo: string }).logo;
    } catch (error) {
      console.warn('Falling back to local settings:', error);
      return null;
    }
  }
};