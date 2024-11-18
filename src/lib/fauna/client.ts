import { Client } from 'fauna';

export const getFaunaClient = () => {
  // For server-side (Netlify functions)
  const serverSecret = process.env.FAUNA_SECRET_KEY;
  // For client-side
  const clientSecret = import.meta.env.VITE_FAUNA_SECRET_KEY;
  
  const secret = serverSecret || clientSecret;
  
  if (!secret) {
    throw new Error('Fauna secret key not found in environment variables');
  }

  return new Client({ secret });
};

export const faunaClient = getFaunaClient();