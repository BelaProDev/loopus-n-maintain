import { getFaunaClient, handleFaunaError } from './client';
import { fql } from 'fauna';
import { ToQueryArg } from './types';

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
    if (!client) throw new Error('Fauna client not initialized');

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
      return handleFaunaError(error, defaultWhatsAppSettings);
    }
  },

  updateWhatsAppNumbers: async (numbers: WhatsAppSettings) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

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
      return handleFaunaError(error, null);
    }
  }
};