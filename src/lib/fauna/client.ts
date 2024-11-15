import { Client, fql } from 'fauna';

let faunaClient: Client | null = null;

export const getFaunaClient = () => {
  if (!faunaClient) {
    const faunaKey = import.meta.env.VITE_FAUNA_SECRET_KEY;
    if (!faunaKey) {
      console.error('Fauna secret key not found in environment variables');
      return null;
    }
    faunaClient = new Client({ secret: faunaKey });
  }
  return faunaClient;
};

export const handleFaunaError = (error: unknown, fallbackData: unknown) => {
  console.error('Fauna DB Error:', error);
  return fallbackData;
};

export { fql };