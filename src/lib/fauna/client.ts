import { Client, QuerySuccess, fql, type Query, type QueryValue } from 'fauna';

let faunaClient: Client | null = null;

export const getFaunaClient = (): Client => {
  if (!faunaClient) {
    const faunaSecret = import.meta.env.VITE_FAUNA_SECRET_KEY;
    if (!faunaSecret) {
      throw new Error('VITE_FAUNA_SECRET_KEY is not defined');
    }
    faunaClient = new Client({ secret: faunaSecret });
  }
  return faunaClient;
};

export const executeQuery = async <T>(query: string): Promise<T> => {
  const client = getFaunaClient();
  const fqlQuery = fql`${query}`;
  const result = await client.query(fqlQuery);
  return result.data as T;
};

export const handleFaunaError = (error: any): never => {
  console.error('Fauna error:', error);
  throw new Error(error.message || 'An error occurred while accessing the database');
};