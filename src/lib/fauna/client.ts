import { Client, type ClientConfiguration } from 'fauna';

export const getFaunaClient = () => {
  if (typeof window === 'undefined') return null;
  
  const secret = import.meta.env.VITE_FAUNA_SECRET_KEY;
  if (!secret) {
    console.warn('Fauna secret key not found');
    return null;
  }

  try {
    const config: ClientConfiguration = {
      secret,
      endpoint: import.meta.env.VITE_FAUNA_ENDPOINT || 'https://db.fauna.com',
      // Add reasonable defaults for our use case
      query_timeout_ms: 30000,
      max_attempts: 3,
      typecheck: true
    };
    return new Client(config);
  } catch (error) {
    console.error('Failed to initialize Fauna client:', error);
    return null;
  }
};

export const handleFaunaError = (error: any, fallbackData: any) => {
  console.error('Fauna DB Error:', error);
  return fallbackData;
};