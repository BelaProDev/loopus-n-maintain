import { faunaClient } from "./client";
import { WhatsAppNumbers, NavigationLink } from "./types";

export const settingsQueries = {
  getWhatsAppNumbers: async (): Promise<WhatsAppNumbers> => {
    try {
      const result = await faunaClient.query({
        collection: "whatsapp_numbers",
        query: `
          let doc = whatsapp_numbers.all().first()
          {
            electrics: doc!.electrics,
            plumbing: doc!.plumbing,
            ironwork: doc!.ironwork,
            woodwork: doc!.woodwork,
            architecture: doc!.architecture
          }
        `
      });
      return result.data;
    } catch (error) {
      console.error('Error fetching WhatsApp numbers:', error);
      return {
        electrics: "",
        plumbing: "",
        ironwork: "",
        woodwork: "",
        architecture: ""
      };
    }
  },

  updateWhatsAppNumbers: async (numbers: WhatsAppNumbers) => {
    try {
      const result = await faunaClient.query({
        collection: "whatsapp_numbers",
        query: `
          let doc = whatsapp_numbers.all().first()
          doc!.update(${JSON.stringify(numbers)})
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
      const result = await faunaClient.query({
        collection: "navigation_links",
        query: `navigation_links.all().map(link => {
          label: link.label,
          url: link.url,
          location: link.location
        })`
      });
      return Array.isArray(result.data) ? result.data : [];
    } catch (error) {
      console.error('Error fetching navigation links:', error);
      return [];
    }
  },

  updateNavigationLink: async (link: NavigationLink) => {
    try {
      const result = await faunaClient.query({
        collection: "navigation_links",
        query: `navigation_links.create(${JSON.stringify(link)})`
      });
      return result.data;
    } catch (error) {
      console.error('Error updating navigation link:', error);
      throw error;
    }
  }
};