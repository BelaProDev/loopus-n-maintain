import { Client, fql } from 'fauna';

export const getFaunaClient = () => {
  const secret = import.meta.env.VITE_FAUNA_SECRET_KEY;
  
  if (!secret) {
    throw new Error('VITE_FAUNA_SECRET_KEY not found in environment variables');
  }

  return new Client({ secret });
};

export { fql };

export const handleFaunaError = (error: unknown, defaultValue: any) => {
  console.error('Fauna error:', error);
  return defaultValue;
};

export const faunaClient = getFaunaClient();