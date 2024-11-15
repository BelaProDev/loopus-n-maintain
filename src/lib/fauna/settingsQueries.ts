import { getFaunaClient } from './client';
import { fql } from 'fauna';
import { NavigationLink, WhatsAppNumbers } from './types';
import { extractFaunaData } from './utils';

export const settingsQueries = {
  getWhatsAppNumbers: async (): Promise<WhatsAppNumbers> => {
    const client = getFaunaClient();
    if (!client) return {
      electrics: "",
      plumbing: "",
      ironwork: "",
      woodwork: "",
      architecture: ""
    };

    try {
      const query = fql`
        let settings = settings.firstWhere(.key == "whatsapp_numbers");
        settings.value
      `;
      const result = await client.query(query);
      return result.data || {};
    } catch (error) {
      console.error('Failed to fetch WhatsApp numbers:', error);
      return {
        electrics: "",
        plumbing: "",
        ironwork: "",
        woodwork: "",
        architecture: ""
      };
    }
  },

  updateWhatsAppNumbers: async (numbers: WhatsAppNumbers): Promise<WhatsAppNumbers> => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const query = fql`
        let setting = settings.firstWhere(.key == "whatsapp_numbers");
        if (setting == null) {
          settings.create({
            key: "whatsapp_numbers",
            value: ${numbers}
          })
        } else {
          setting.update({
            value: ${numbers}
          })
        }
      `;
      const result = await client.query(query);
      return result.data.value;
    } catch (error) {
      console.error('Failed to update WhatsApp numbers:', error);
      throw error;
    }
  },

  getNavigationLinks: async (): Promise<NavigationLink[]> => {
    const client = getFaunaClient();
    if (!client) return [];

    try {
      const query = fql`
        navigation_links.all()
      `;
      const result = await client.query(query);
      const documents = extractFaunaData(result);
      return documents.map(doc => ({ id: doc.ref.id, ...doc.data }));
    } catch (error) {
      console.error('Failed to fetch navigation links:', error);
      return [];
    }
  },

  createNavigationLink: async (link: Omit<NavigationLink, 'id'>): Promise<NavigationLink> => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const query = fql`
        navigation_links.create(${link})
      `;
      const result = await client.query(query);
      const document = extractFaunaData(result)[0];
      return { id: document.ref.id, ...document.data };
    } catch (error) {
      console.error('Failed to create navigation link:', error);
      throw error;
    }
  },

  updateNavigationLink: async (id: string, link: Omit<NavigationLink, 'id'>): Promise<NavigationLink> => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const query = fql`
        let doc = navigation_links.byId(${id});
        doc.update(${link})
      `;
      const result = await client.query(query);
      const document = extractFaunaData(result)[0];
      return { id: document.ref.id, ...document.data };
    } catch (error) {
      console.error('Failed to update navigation link:', error);
      throw error;
    }
  },

  deleteNavigationLink: async (id: string): Promise<boolean> => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const query = fql`
        navigation_links.byId(${id}).delete()
      `;
      await client.query(query);
      return true;
    } catch (error) {
      console.error('Failed to delete navigation link:', error);
      return false;
    }
  }
};