import fallbackDb from '../fallback-db.json';
import type { WhatsAppNumber, WhatsAppNumbers } from '@/types/business';

interface SettingsValue {
  numbers?: WhatsAppNumber[];
  logo?: string;
}

interface Setting {
  key: string;
  value: SettingsValue;
}

const defaultWhatsAppNumbers: WhatsAppNumbers = [
  { id: '1', name: 'Electrics', number: '', service: 'electrics' },
  { id: '2', name: 'Plumbing', number: '', service: 'plumbing' },
  { id: '3', name: 'Ironwork', number: '', service: 'ironwork' },
  { id: '4', name: 'Woodwork', number: '', service: 'woodwork' },
  { id: '5', name: 'Architecture', number: '', service: 'architecture' }
];

export const settingsQueries = {
  getWhatsAppNumbers: (): WhatsAppNumbers => {
    try {
      const whatsappSettings = fallbackDb.settings.find(s => s.key === 'whatsapp_numbers');
      return whatsappSettings?.value?.numbers || defaultWhatsAppNumbers;
    } catch (error) {
      console.warn('Error reading from fallback DB:', error);
      return defaultWhatsAppNumbers;
    }
  },

  updateWhatsAppNumbers: (numbers: WhatsAppNumbers): WhatsAppNumbers => {
    try {
      const settings = fallbackDb.settings as Setting[];
      const index = settings.findIndex(s => s.key === 'whatsapp_numbers');
      
      if (index !== -1) {
        settings[index].value = { numbers };
      } else {
        settings.push({
          key: 'whatsapp_numbers',
          value: { numbers }
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
      const logoSetting = fallbackDb.settings.find(s => s.key === 'logo') as Setting | undefined;
      return logoSetting?.value?.logo || null;
    } catch (error) {
      console.warn('Error reading from fallback DB:', error);
      return null;
    }
  },

  updateLogo: (base64String: string): string | null => {
    try {
      const settings = fallbackDb.settings as Setting[];
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