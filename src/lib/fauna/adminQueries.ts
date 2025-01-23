import { getFaunaClient } from './client';
import { query as q } from 'faunadb';

export interface AdminUser {
  email: string;
  password: string;
  role: 'admin';
}

export const adminQueries = {
  validateAdmin: async (email: string, password: string): Promise<AdminUser | null> => {
    try {
      const response = await fetch('/.netlify/functions/auth-admin', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.success ? data.user : null;
    } catch (error) {
      console.error('Admin auth query error:', error);
      return null;
    }
  }
};
