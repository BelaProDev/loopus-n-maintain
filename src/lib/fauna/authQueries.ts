import { getFaunaClient } from './client';
import { fql } from 'fauna';
import { extractFaunaData } from './utils';
import { hashPassword } from '../auth/authUtils';

export interface EmailUser {
  email: string;
  password: string;
  type: string;
  name: string;
}

export const authQueries = {
  validateUser: async (email: string, password: string): Promise<EmailUser | null> => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const hashedPassword = hashPassword(password);
      const query = fql`
        admin_koalax.firstWhere(.email == ${email} && .password == ${hashedPassword})
      `;
      const result = await client.query(query);
      const data = extractFaunaData(result);
      return data[0]?.data as EmailUser | null;
    } catch (error) {
      console.error('Auth query error:', error);
      return null;
    }
  }
};