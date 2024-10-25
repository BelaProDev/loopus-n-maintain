import { Client, query as q } from 'faunadb';

const client = new Client({
  secret: import.meta.env.VITE_FAUNA_SECRET_KEY,
  domain: 'db.fauna.com', // Changed to US domain
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
        q.Map(
          q.Paginate(q.Documents(q.Collection('emails'))),
          q.Lambda('ref', q.Get(q.Var('ref')))
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
      q.Create(q.Collection('emails'), { data })
    );
  },

  updateEmail: async (id: string, data: EmailData) => {
    return await client.query<FaunaDocument<EmailData>>(
      q.Update(q.Ref(q.Collection('emails'), id), { data })
    );
  },

  deleteEmail: async (id: string) => {
    return await client.query<FaunaDocument<EmailData>>(
      q.Delete(q.Ref(q.Collection('emails'), id))
    );
  }
};

export { client, q };
