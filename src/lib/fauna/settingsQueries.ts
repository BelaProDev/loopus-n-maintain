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
      return result as WhatsAppSettings;
    } catch (error) {
      return handleFaunaError(error, {
        electrics: "",
        plumbing: "",
        ironwork: "",
        woodwork: "",
        architecture: ""
      });
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