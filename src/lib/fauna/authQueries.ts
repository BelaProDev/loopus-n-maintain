import { getFaunaClient } from './client';
import { fql } from 'fauna';
import { extractFaunaData } from './utils';

export const authQueries = {
  validateUser: async (email: string, password: string) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(
        fql`emails.firstWhere(.email == ${email} && .password == ${password})`
      );
      const data = extractFaunaData(result);
      return data[0] || null;
    } catch (error) {
      console.error('Auth query error:', error);
      return null;
    }
  }
};