import { Client, query as q } from 'faunadb';

const client = new Client({
  //secret: import.meta.env.VITE_FAUNA_SECRET_KEY || 'fnacapi_omd2ZXJzaW9uAWdwYXlsb2FkWFiiYmlkcjQxMjYzODQzOTcxMTcwMzYyNmZzZWNyZXR4OFg1bi96RCtxK3lDM05ZQUV3ZkVhN0JaVnF2K1lxdVhSTUp0cXBmdDhZVjhrTHMvb0hZeDd0Zz09',
  secret: 'fnAFuf4jtpAAy8lNKmRRSr7l4MIOWWs6aR1PmFnk',
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
    const response = await client.query<FaunaResponse<FaunaDocument<EmailData>>>(
      q.Map(
        q.Paginate(q.Documents(q.Collection('emails'))),
        q.Lambda('ref', q.Get(q.Var('ref')))
      )
    );
    return response.data;
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