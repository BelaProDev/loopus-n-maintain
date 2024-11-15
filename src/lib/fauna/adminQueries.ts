import { getFaunaClient } from './client';
import { fql } from 'fauna';
import { extractFaunaData } from './utils';
import { hashPassword } from '../auth/authUtils';

export interface AdminUser {
  email: string;
  password: string;
  role: 'admin';
}

export const adminQueries = {
  validateAdmin: async (email: string, password: string): Promise<AdminUser | null> => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const hashedPassword = hashPassword(password);
      const query = fql`
        admin_koalax.firstWhere(.email == ${email} && .password == ${hashedPassword})
      `;
      const result = await client.query(query);
      const data = extractFaunaData(result);
      return data[0]?.data as AdminUser | null;
    } catch (error) {
      console.error('Admin auth query error:', error);
      return null;
    }
  }
};