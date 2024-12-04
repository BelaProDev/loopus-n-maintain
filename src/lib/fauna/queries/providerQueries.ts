import { getFaunaClient } from '../client';
import { fql } from 'fauna';
import type { Provider } from '@/types/business';
import { extractFaunaData } from '../utils';

export const providerQueries = {
  getProviders: async (): Promise<Provider[]> => {
    const client = getFaunaClient();
    if (!client) return [];
    try {
      const query = fql`
        let providers = providers.all()
        providers {
          id: providers.id,
          name: providers.name,
          email: providers.email,
          phone: providers.phone,
          service: providers.service,
          availability: providers.availability,
          specialties: providers.specialties
        }
      `;
      const result = await client.query(query);
      return extractFaunaData<Provider>(result);
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
        let newProvider = providers.create({
          name: ${data.name},
          email: ${data.email},
          phone: ${data.phone},
          service: ${data.service},
          availability: ${data.availability || true},
          specialties: ${data.specialties || []}
        })
        {
          id: newProvider.id,
          name: newProvider.name,
          email: newProvider.email,
          phone: newProvider.phone,
          service: newProvider.service,
          availability: newProvider.availability,
          specialties: newProvider.specialties
        }
      `;
      const result = await client.query(query);
      const documents = extractFaunaData<Provider>(result);
      return documents[0] || null;
    } catch (error) {
      console.error('Error creating provider:', error);
      return null;
    }
  }
};