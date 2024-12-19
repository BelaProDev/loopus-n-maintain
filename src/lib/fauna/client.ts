import { Client, fql } from "fauna";

const client = new Client({
  secret: import.meta.env.VITE_FAUNA_SECRET_KEY || '',
  endpoint: new URL('https://db.fauna.com'),
});

export { client, fql };