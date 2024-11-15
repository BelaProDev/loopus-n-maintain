import { getFaunaClient } from '../client';
import { fql } from 'fauna';
import type { Provider } from '@/types/business';
import { extractFaunaData } from '../utils';

export const providerQueries = {
  getProviders: async (): Promise<Provider[]> => {
    const client = getFaunaClient();
    if (!client) return [];
    try {
      const query = fql`providers.all()`;
      const result = await client.query(query);
      const documents = extractFaunaData<Provider>(result);
      return documents.map(doc => ({ id: doc.ref.id, ...doc.data }));
    } catch (error) {
      console.error('Error fetching providers:', error);
      return [];
    }
  },

  createProvider: async (data: Omit<Provider, 'id'>) => {
    const client = getFaunaClient();
    if (!client) return null;
    try {
      const query = fql`
        providers.create({
          name: ${data.name},
          email: ${data.email},
          phone: ${data.phone},
          service: ${data.service},
          availability: ${data.availability},
          rating: ${data.rating},
          specialties: ${data.specialties}
        })
      `;
      const result = await client.query(query);
      const document = extractFaunaData<Provider>(result)[0];
      return document ? { id: document.ref.id, ...document.data } : null;
    } catch (error) {
      return null;
    }
  }
};