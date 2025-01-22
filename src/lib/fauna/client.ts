import { Client, QueryValue } from 'faunadb';

let faunaClient: Client | null = null;

export const getFaunaClient = (): Client => {
  if (!faunaClient) {
    const faunaSecret = import.meta.env.VITE_FAUNA_SECRET;
    if (!faunaSecret) {
      throw new Error('VITE_FAUNA_SECRET is not defined');
    }
    faunaClient = new Client({ secret: faunaSecret });
  }
  return faunaClient;
};

export const executeQuery = async <T = any>(query: QueryValue): Promise<T> => {
  const client = getFaunaClient();
  return client.query<T>(query);
};

export const handleFaunaError = (error: any): never => {
  console.error('Fauna error:', error);
  throw new Error(error.message || 'An error occurred while accessing the database');
};