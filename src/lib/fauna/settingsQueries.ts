import { client, fql } from './client';
import type { WhatsAppNumbers } from '@/types/dropbox';
import { settingsQueries as fallbackQueries } from '../db/settingsDb';

export const settingsQueries = {
  getWhatsAppNumbers: async () => {
    try {
      const result = await client.query(fql`
        settings.firstWhere(.key == "whatsapp_numbers")
      `);
      return result?.data as WhatsAppNumbers || fallbackQueries.getWhatsAppNumbers();
    } catch (error) {
      console.warn('Falling back to local settings:', error);
      return fallbackQueries.getWhatsAppNumbers();
    }
  },

  updateWhatsAppNumbers: async (numbers: WhatsAppNumbers) => {
    try {
      const result = await client.query(fql`
        let setting = settings.firstWhere(.key == "whatsapp_numbers")
        setting.update({ data: ${numbers} })
      `);
      return result?.data as WhatsAppNumbers;
    } catch (error) {
      console.warn('Falling back to local settings:', error);
      return fallbackQueries.updateWhatsAppNumbers(numbers);
    }
  },

  getLogo: async () => {
    try {
      const result = await client.query(fql`
        settings.firstWhere(.key == "logo")
      `);
      return result?.data?.logo as string || null;
    } catch (error) {
      console.warn('Falling back to local settings:', error);
      return null;
    }
  },

  updateLogo: async (base64String: string) => {
    try {
      const result = await client.query(fql`
        let setting = settings.firstWhere(.key == "logo")
        setting.update({ data: { logo: ${base64String} } })
      `);
      return result?.data?.logo as string;
    } catch (error) {
      console.warn('Falling back to local settings:', error);
      return null;
    }
  }
};