import { Client, fql, type Query, type QueryValue } from 'fauna';

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

export const executeQuery = async <T extends QueryValue>(queryString: string): Promise<T> => {
  const client = getFaunaClient();
  const query = fql([queryString]) as Query<T>;
  const result = await client.query(query);
  return result.data;
};

export const handleFaunaError = (error: any): never => {
  console.error('Fauna error:', error);
  throw new Error(error.message || 'An error occurred while accessing the database');
};