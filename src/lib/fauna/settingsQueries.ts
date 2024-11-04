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
    const client = getFaunaClient();
    if (!client) {
      // Return from fallback DB if no Fauna client
      const whatsappSettings = fallbackDb.settings.find(s => s.key === 'whatsapp_numbers');
      return whatsappSettings?.value || defaultWhatsAppSettings;
    }

    try {
      const result = await client.query(fql`
        let doc = Collection.byName("settings")!
          .firstWhere(.type == "whatsapp")
        doc.data
      `);
      
      // Type assertion after validating the shape
      const data = result as unknown as WhatsAppSettings;
      if (!data || typeof data !== 'object') return defaultWhatsAppSettings;
      
      // Ensure all required properties exist
      return {
        electrics: data.electrics || "",
        plumbing: data.plumbing || "",
        ironwork: data.ironwork || "",
        woodwork: data.woodwork || "",
        architecture: data.architecture || ""
      };
    } catch (error) {
      // On Fauna error, return from fallback DB
      const whatsappSettings = fallbackDb.settings.find(s => s.key === 'whatsapp_numbers');
      return whatsappSettings?.value || defaultWhatsAppSettings;
    }
  },

  updateWhatsAppNumbers: async (numbers: WhatsAppSettings) => {
    const client = getFaunaClient();
    if (!client) {
      // Update fallback DB if no Fauna client
      const settings = fallbackDb.settings;
      const whatsappIndex = settings.findIndex(s => s.key === 'whatsapp_numbers');
      if (whatsappIndex >= 0) {
        settings[whatsappIndex].value = numbers;
      } else {
        settings.push({ key: 'whatsapp_numbers', value: numbers });
      }
      return numbers;
    }

    try {
      const queryData: ToQueryArg<WhatsAppSettings> = { ...numbers };
      const result = await client.query(fql`
        let doc = Collection.byName("settings")!
          .firstWhere(.type == "whatsapp")
        
        if (doc != null) {
          doc.update({ data: ${queryData} })
        } else {
          Collection.byName("settings")!.create({
            data: ${queryData},
            type: "whatsapp"
          })
        }
      `);
      return result;
    } catch (error) {
      // On Fauna error, update fallback DB
      const settings = fallbackDb.settings;
      const whatsappIndex = settings.findIndex(s => s.key === 'whatsapp_numbers');
      if (whatsappIndex >= 0) {
        settings[whatsappIndex].value = numbers;
      } else {
        settings.push({ key: 'whatsapp_numbers', value: numbers });
      }
      return numbers;
    }
  }
};