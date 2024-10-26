import { Client, Collection, Create, Delete, Documents, Get, Lambda, Map, Paginate, Query, Ref, Update, Var } from 'faunadb';

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
        Map(
          Paginate(Documents(Collection('emails'))),
          Lambda('ref', Get(Var('ref')))
        )
      );
      return response.data;
    } catch (error) {
      console.error('Fauna DB Error:', error);
      return [];
    }
  },

  createEmail: async (data: EmailData) => {
    return await client.query<FaunaDocument<EmailData>>(
      Create(Collection('emails'), { data })
    );
  },

  updateEmail: async (id: string, data: EmailData) => {
    return await client.query<FaunaDocument<EmailData>>(
      Update(Ref(Collection('emails'), id), { data })
    );
  },

  deleteEmail: async (id: string) => {
    return await client.query<FaunaDocument<EmailData>>(
      Delete(Ref(Collection('emails'), id))
    );
  }
};

export { client, Query };