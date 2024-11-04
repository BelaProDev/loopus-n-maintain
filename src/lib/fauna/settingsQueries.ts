import { getFaunaClient, handleFaunaError } from './client';
import { fql } from 'fauna';
import { ToQueryArg } from './types';
import fallbackDb from '../fallback-db.json';

interface WhatsAppSettings {
  electrics: string;
  plumbing: string;
  ironwork: string;
  woodwork: string;
  architecture: string;
}

const defaultWhatsAppSettings: WhatsAppSettings = {
  electrics: "",
  plumbing: "",
  ironwork: "",
  woodwork: "",
  architecture: ""
};

export const settingsQueries = {
  getWhatsAppNumbers: async () => {
    // Always return from fallback DB
    const whatsappSettings = fallbackDb.settings.find(s => s.key === 'whatsapp_numbers');
    return whatsappSettings?.value || defaultWhatsAppSettings;
  },

  updateWhatsAppNumbers: async (numbers: WhatsAppSettings) => {
    // Update fallback DB
    const settings = fallbackDb.settings;
    const whatsappIndex = settings.findIndex(s => s.key === 'whatsapp_numbers');
    if (whatsappIndex >= 0) {
      settings[whatsappIndex].value = numbers;
    } else {
      settings.push({ key: 'whatsapp_numbers', value: numbers });
    }
    return numbers;
  }
};