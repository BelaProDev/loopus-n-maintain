import { Client, QueryArgument } from 'fauna';

export const getFaunaClient = () => {
  if (typeof window === 'undefined') return null;
  return new Client({
    secret: import.meta.env.VITE_FAUNA_SECRET_KEY,
  });
};

export const handleFaunaError = (error: any, fallbackData: any) => {
  console.error('Fauna DB Error:', error);
  return fallbackData;
};

export const sanitizeForFauna = <T extends object>(data: T): QueryArgument => {
  const sanitized = JSON.parse(JSON.stringify(data));
  return sanitized as QueryArgument;
};