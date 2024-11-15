import { getFaunaClient, fql } from "./client";
import { WhatsAppNumbers, NavigationLink } from "./types";

export const settingsQueries = {
  getWhatsAppNumbers: async (): Promise<WhatsAppNumbers> => {
    try {
      const client = getFaunaClient();
      if (!client) {
        throw new Error('Fauna client not initialized');
      }

      const result = await client.query({
        query: fql`
          let doc = whatsapp_numbers.all().first()!
          {
            electrical: doc.electrical,
            plumbing: doc.plumbing,
            ironwork: doc.ironwork,
            woodwork: doc.woodwork,
            architecture: doc.architecture
          }
        `
      });

      return result.data;
    } catch (error) {
      console.error('Error fetching WhatsApp numbers:', error);
      return {
        electrical: "",
        plumbing: "",
        ironwork: "",
        woodwork: "",
        architecture: ""
      };
    }
  },

  updateWhatsAppNumbers: async (numbers: WhatsAppNumbers) => {
    try {
      const client = getFaunaClient();
      if (!client) {
        throw new Error('Fauna client not initialized');
      }

      const result = await client.query({
        query: fql`
          let doc = whatsapp_numbers.all().first()!
          doc.update(${numbers})
        `
      });
      return result.data;
    } catch (error) {
      console.error('Error updating WhatsApp numbers:', error);
      throw error;
    }
  },

  getNavigationLinks: async (): Promise<NavigationLink[]> => {
    try {
      const client = getFaunaClient();
      if (!client) {
        throw new Error('Fauna client not initialized');
      }

      const result = await client.query({
        query: fql`
          navigation_links.all().map(link => {
            label: link.label,
            url: link.url,
            location: link.location
          })
        `
      });
      return Array.isArray(result.data) ? result.data : [];
    } catch (error) {
      console.error('Error fetching navigation links:', error);
      return [];
    }
  },

  updateNavigationLink: async (link: NavigationLink) => {
    try {
      const client = getFaunaClient();
      if (!client) {
        throw new Error('Fauna client not initialized');
      }

      const result = await client.query({
        query: fql`
          navigation_links.create(${link})
        `
      });
      return result.data;
    } catch (error) {
      console.error('Error updating navigation link:', error);
      throw error;
    }
  }
};