import { getFaunaClient, fql, handleFaunaError } from './client';
import { WhatsAppNumbers, NavigationLink } from './types';

export const settingsQueries = {
  getWhatsAppNumbers: async (): Promise<WhatsAppNumbers> => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        let doc = whatsapp_numbers.all().first()
        {
          electrics: doc!.electrics,
          plumbing: doc!.plumbing,
          ironwork: doc!.ironwork,
          woodwork: doc!.woodwork,
          architecture: doc!.architecture
        }
      `);
      return result.data as WhatsAppNumbers;
    } catch (error) {
      return handleFaunaError(error, {
        electrics: "",
        plumbing: "",
        ironwork: "",
        woodwork: "",
        architecture: ""
      }) as WhatsAppNumbers;
    }
  },

  updateWhatsAppNumbers: async (numbers: WhatsAppNumbers): Promise<void> => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const queryArg = {
        electrics: numbers.electrics,
        plumbing: numbers.plumbing,
        ironwork: numbers.ironwork,
        woodwork: numbers.woodwork,
        architecture: numbers.architecture
      };

      await client.query(fql`
        let existing = whatsapp_numbers.all().first()
        if (existing == null) {
          whatsapp_numbers.create(${queryArg})
        } else {
          existing.update(${queryArg})
        }
      `);
    } catch (error) {
      handleFaunaError(error, null);
    }
  },

  getNavigationLinks: async (): Promise<NavigationLink[]> => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        navigation_links.all().map(link => {
          {
            label: link.label,
            url: link.url,
            location: link.location
          }
        })
      `);
      return result.data as NavigationLink[];
    } catch (error) {
      return handleFaunaError(error, []) as NavigationLink[];
    }
  },

  updateNavigationLink: async (link: NavigationLink): Promise<void> => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const queryArg = {
        label: link.label,
        url: link.url,
        location: link.location
      };

      await client.query(fql`
        navigation_links.create(${queryArg})
      `);
    } catch (error) {
      handleFaunaError(error, null);
    }
  }
};