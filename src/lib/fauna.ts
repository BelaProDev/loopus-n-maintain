import { Client, query as q } from 'faunadb';

const client = new Client({
  secret: import.meta.env.VITE_FAUNA_PUBLIC_KEY || '',
  domain: 'db.fauna.com',
});

export const faunaQueries = {
  getAllServices: async () => {
    try {
      const response = await fetch('/.netlify/functions/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      return await response.json();
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  createService: async (serviceData: any) => {
    try {
      const response = await fetch('/.netlify/functions/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });
      if (!response.ok) throw new Error('Failed to create service');
      return await response.json();
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },
};

export { client, q };