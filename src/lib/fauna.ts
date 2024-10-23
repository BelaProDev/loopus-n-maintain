import { Client, query as q } from 'faunadb';

const client = new Client({
  secret: import.meta.env.VITE_FAUNA_SECRET_KEY || '',
  domain: 'db.fauna.com',
});

export const faunaQueries = {
  getAllEmails: async () => {
    const response = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('emails'))),
        q.Lambda('ref', q.Get(q.Var('ref')))
      )
    );
    return response.data;
  },

  createEmail: async (data: { email: string; name: string; type: string }) => {
    return await client.query(
      q.Create(q.Collection('emails'), { data })
    );
  },

  updateEmail: async (id: string, data: { email: string; name: string; type: string }) => {
    return await client.query(
      q.Update(q.Ref(q.Collection('emails'), id), { data })
    );
  },

  deleteEmail: async (id: string) => {
    return await client.query(
      q.Delete(q.Ref(q.Collection('emails'), id))
    );
  }
};

export { client, q };
