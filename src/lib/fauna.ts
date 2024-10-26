import { Client, fql } from 'faunadb';

const client = new Client({
  secret: import.meta.env.VITE_FAUNA_SECRET_KEY,
  domain: 'db.fauna.com',
});

interface FaunaResponse<T> {
  data: T[];
}

interface FaunaDocument<T> {
  ref: { id: string };
  data: T;
}

interface EmailData {
  email: string;
  name: string;
  type: string;
}

export const faunaQueries = {
  getAllEmails: async () => {
    try {
      const response = await client.query<FaunaResponse<FaunaDocument<EmailData>>>(
        fql`
          emails.all() {
            id,
            data: {
              email,
              name,
              type
            }
          }
        `
      );
      return response.data;
    } catch (error) {
      console.error('Fauna DB Error:', error);
      return [];
    }
  },

  createEmail: async (data: EmailData) => {
    return await client.query<FaunaDocument<EmailData>>(
      fql`
        emails.create({
          data: {
            email: ${data.email},
            name: ${data.name},
            type: ${data.type}
          }
        })
      `
    );
  },

  updateEmail: async (id: string, data: EmailData) => {
    return await client.query<FaunaDocument<EmailData>>(
      fql`
        emails.byId(${id}).update({
          data: {
            email: ${data.email},
            name: ${data.name},
            type: ${data.type}
          }
        })
      `
    );
  },

  deleteEmail: async (id: string) => {
    return await client.query<FaunaDocument<EmailData>>(
      fql`emails.byId(${id}).delete()`
    );
  }
};

export { client, fql };