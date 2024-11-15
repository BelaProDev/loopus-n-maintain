import { getFaunaClient } from './client';
import { fql } from 'fauna';
import { extractFaunaData } from './utils';

export interface EmailUser {
  email: string;
  password: string;
  type: string;
  name: string;
}

export const authQueries = {
  validateUser: async (email: string, password: string) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(
        fql`emails.firstWhere(.email == ${JSON.stringify(email)} && .password == ${JSON.stringify(password)})`
      );
      const data = extractFaunaData(result);
      return data[0]?.data as EmailUser | null;
    } catch (error) {
      console.error('Auth query error:', error);
      return null;
    }
  }
};