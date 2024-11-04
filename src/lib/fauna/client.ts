import { Client } from 'fauna';

export const getFaunaClient = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    return new Client({
      secret: import.meta.env.VITE_FAUNA_SECRET_KEY,
    });
  } catch (error) {
    console.error('Failed to initialize Fauna client:', error);
    return null;
  }
};

export const handleFaunaError = (error: any, fallbackData: any) => {
  console.error('Fauna DB Error:', error);
  return fallbackData;
};