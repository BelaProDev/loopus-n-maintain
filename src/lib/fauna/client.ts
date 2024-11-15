import { Client, fql } from 'fauna';

let client: Client | null = null;

export const getFaunaClient = () => {
  if (!client) {
    const faunaKey = import.meta.env.VITE_FAUNA_SECRET_KEY;
    if (!faunaKey) {
      console.error('Fauna secret key not found in environment variables');
      return null;
    }
    client = new Client({ secret: faunaKey });
  }
  return client;
};

export const client = getFaunaClient();

export { fql };