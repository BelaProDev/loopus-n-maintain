import { getFaunaClient, fql } from "./client";
import { WhatsAppNumbers } from "@/types/dropbox";

export const settingsQueries = {
  getWhatsAppNumbers: async (): Promise<WhatsAppNumbers> => {
    try {
      const client = getFaunaClient();
      if (!client) {
        throw new Error('Fauna client not initialized');
      }

      const whatsappSettings = await client.query(fql`
        let doc = whatsapp_numbers.all().first()!
        {
          number: doc.number,
          name: doc.name,
          services: {
            electrics: doc.services.electrics,
            plumbing: doc.services.plumbing,
            ironwork: doc.services.ironwork,
            woodwork: doc.services.woodwork,
            architecture: doc.services.architecture
          }
        }
      `);

      return whatsappSettings.data as WhatsAppNumbers;
    } catch (error) {
      console.error('Error fetching WhatsApp numbers:', error);
      return {
        number: "",
        name: "",
        services: {}
      };
    }
  },

  updateWhatsAppNumbers: async (numbers: WhatsAppNumbers) => {
    try {
      const client = getFaunaClient();
      if (!client) {
        throw new Error('Fauna client not initialized');
      }

      const result = await client.query(fql`
        let doc = whatsapp_numbers.all().first()!
        doc.update(${numbers})
      `);
      return result.data as WhatsAppNumbers;
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

      const result = await client.query(fql`
        navigation_links.all().map(link => {
          {
            label: link.label,
            url: link.url,
            location: link.location
          }
        })
      `);
      return (Array.isArray(result.data) ? result.data : []) as NavigationLink[];
    } catch (error) {
      console.error('Error fetching navigation links:', error);
      return [];
    }
  },

  updateNavigationLink: async (link: ToQueryArg<NavigationLink>) => {
    try {
      const client = getFaunaClient();
      if (!client) {
        throw new Error('Fauna client not initialized');
      }

      const result = await client.query(fql`
        navigation_links.create(${link})
      `);
      return result.data as NavigationLink;
    } catch (error) {
      console.error('Error updating navigation link:', error);
      throw error;
    }
  },

  getLogo: async (): Promise<string | null> => {
    try {
      const client = getFaunaClient();
      if (!client) {
        throw new Error('Fauna client not initialized');
      }

      const result = await client.query(fql`
        let logo = site_settings.all().firstWhere(.key == "logo")
        if (logo != null) {
          logo!.value
        } else {
          null
        }
      `);

      return result.data as string | null;
    } catch (error) {
      console.error('Error fetching logo:', error);
      return null;
    }
  },

  updateLogo: async (imageData: string): Promise<void> => {
    try {
      const client = getFaunaClient();
      if (!client) {
        throw new Error('Fauna client not initialized');
      }

      await client.query(fql`
        let existingLogo = site_settings.all().firstWhere(.key == "logo")
        if (existingLogo != null) {
          existingLogo!.update({
            value: ${imageData}
          })
        } else {
          site_settings.create({
            key: "logo",
            value: ${imageData}
          })
        }
      `);
    } catch (error) {
      console.error('Error updating logo:', error);
      throw error;
    }
  }
};
