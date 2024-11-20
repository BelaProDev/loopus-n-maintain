import { getFaunaClient, fql } from "./client";
import { WhatsAppNumbers, NavigationLink } from "./types";
import { ToQueryArg } from "./types";

export const settingsQueries = {
  getWhatsAppNumbers: async (): Promise<WhatsAppNumbers> => {
    try {
      const client = getFaunaClient();
      if (!client) {
        throw new Error('Fauna client not initialized');
      }

      const result = await client.query(fql`
        let doc = whatsapp_numbers.all().first()!
        {
          electrics: doc.electrics,
          plumbing: doc.plumbing,
          ironwork: doc.ironwork,
          woodwork: doc.woodwork,
          architecture: doc.architecture
        }
      `);

      return result.data as WhatsAppNumbers;
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
        let settings = site_settings.all()
        let logo = settings.firstWhere(.key == "logo")
        logo?.value || null
      `);

      return result.data as string | null;
    } catch (error) {
      console.error('Error fetching logo:', error);
      return null;
    }
  },

  updateLogo: async (base64String: string): Promise<void> => {
    try {
      const client = getFaunaClient();
      if (!client) {
        throw new Error('Fauna client not initialized');
      }

      await client.query(fql`
        let settings = site_settings.all()
        let logo = settings.firstWhere(.key == "logo")
        if (logo == null) {
          site_settings.create({
            key: "logo",
            value: ${base64String}
          })
        } else {
          logo.update({
            value: ${base64String}
          })
        }
      `);
    } catch (error) {
      console.error('Error updating logo:', error);
      throw error;
    }
  }
};