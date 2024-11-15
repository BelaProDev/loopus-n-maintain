import { EmailUser } from './types';

export const authQueries = {
  validateUser: async (email: string, password: string): Promise<EmailUser | null> => {
    try {
      const response = await fetch('/.netlify/functions/auth-user', {
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
      console.error('Auth query error:', error);
      return null;
    }
  },

  validateAdmin: async (email: string, password: string): Promise<EmailUser | null> => {
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

export type { EmailUser };