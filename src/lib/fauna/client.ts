import { Client } from 'faunadb';

export const client = new Client({
  secret: import.meta.env.VITE_FAUNA_SECRET_KEY || '',
  domain: 'db.fauna.com',
});

export const getFaunaClient = () => client;