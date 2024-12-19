import fallbackDb from '../fallback-db.json';
import type { WhatsAppNumbers } from '@/types/dropbox';

const defaultWhatsAppSettings: WhatsAppNumbers = {
  electrics: "",
  plumbing: "",
  ironwork: "",
  woodwork: "",
  architecture: ""
};

export const settingsQueries = {
  getWhatsAppNumbers: (): WhatsAppNumbers => {
    try {
      const whatsappSettings = fallbackDb.settings.find(s => s.key === 'whatsapp_numbers');
      return whatsappSettings?.value || defaultWhatsAppSettings;
    } catch (error) {
      console.warn('Error reading from fallback DB:', error);
      return defaultWhatsAppSettings;
    }
  },

  updateWhatsAppNumbers: (numbers: WhatsAppNumbers): WhatsAppNumbers => {
    try {
      const settings = fallbackDb.settings;
      const index = settings.findIndex(s => s.key === 'whatsapp_numbers');
      
      if (index !== -1) {
        settings[index].value = numbers;
      } else {
        settings.push({
          key: 'whatsapp_numbers',
          value: numbers
        });
      }
      
      return numbers;
    } catch (error) {
      console.warn('Error updating fallback DB:', error);
      return numbers;
    }
  },

  getLogo: (): string | null => {
    try {
      const logoSetting = fallbackDb.settings.find(s => s.key === 'logo');
      return logoSetting?.value?.logo || null;
    } catch (error) {
      console.warn('Error reading from fallback DB:', error);
      return null;
    }
  },

  updateLogo: (base64String: string): string | null => {
    try {
      const settings = fallbackDb.settings;
      const index = settings.findIndex(s => s.key === 'logo');
      
      if (index !== -1) {
        settings[index].value = { logo: base64String };
      } else {
        settings.push({
          key: 'logo',
          value: { logo: base64String }
        });
      }
      
      return base64String;
    } catch (error) {
      console.warn('Error updating fallback DB:', error);
      return null;
    }
  }
};