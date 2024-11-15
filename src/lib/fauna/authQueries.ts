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
      const query = fql`
        emails.firstWhere(.email == ${email} && .password == ${password})
      `;
      const result = await client.query(query);
      return extractFaunaData(result);
    } catch (error) {
      console.error('Auth query error:', error);
      return null;
    }
  }
};