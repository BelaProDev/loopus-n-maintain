import { EmailUser } from './types';

export const authQueries = {
  validateUser: async (email: string, password: string): Promise<EmailUser | null> => {
    try {
      const response = await fetch('/.netlify/functions/auth', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          action: 'validateAdmin'
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
  }
};