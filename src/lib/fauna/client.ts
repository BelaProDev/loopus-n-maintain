import { Client } from 'faunadb';

const client = new Client({
  secret: import.meta.env.VITE_FAUNA_SECRET_KEY || '',
  domain: 'db.fauna.com',
});

export { client };