import { Client, fql, type Query, type QueryValue } from 'fauna';

let faunaClient: Client | null = null;

export const getFaunaClient = (): Client => {
  if (!faunaClient) {
    const faunaSecret = import.meta.env.VITE_FAUNA_SECRET_KEY;
    if (!faunaSecret) {
      throw new Error('VITE_FAUNA_SECRET_KEY is not defined');
    }
    
    faunaClient = new Client({
      secret: faunaSecret,
    });
  }
  return faunaClient;
};

export const executeQuery = async <T>(query: string): Promise<T> => {
  try {
    const client = getFaunaClient();
    const result = await client.query(fql([query]));
    
    if (!result || !result.data) {
      throw new Error('Invalid response from Fauna');
    }
    
    return result.data as T;
  } catch (error) {
    console.error('Fauna query error:', error);
    throw error;
  }
};

export const handleFaunaError = (error: unknown): never => {
  console.error('Fauna error:', error);
  throw new Error('An error occurred while accessing the database');
};