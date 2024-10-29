import { QueryArgument } from 'fauna';

export const handleFaunaError = (error: any, fallbackData: any) => {
  console.error('Fauna DB Error:', error);
  return fallbackData;
};

export const sanitizeForFauna = <T extends object>(data: T): QueryArgument => {
  const sanitized = JSON.parse(JSON.stringify(data));
  return sanitized as QueryArgument;
};