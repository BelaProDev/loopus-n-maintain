import { Client, query as q } from 'faunadb';

const client = new Client({
  secret: import.meta.env.VITE_FAUNA_SECRET_KEY || '',
  domain: 'db.fauna.com',
});

export const fauna = {
  client,
  query: q,
  find: async (collection: string, query = {}) => {
    try {
      const result = await client.query(
        q.Map(
          q.Paginate(q.Documents(q.Collection(collection))),
          q.Lambda('ref', q.Get(q.Var('ref')))
        )
      );
      
      if ('data' in result) {
        return result.data.map((item: any) => ({
          ...item.data,
          ref: item.ref
        }));
      }
      return [];
    } catch (error) {
      console.error('Fauna find error:', error);
      // Fallback to local data if Fauna fails
      const fallbackData = (await import('./fallback-db.json')).default;
      return fallbackData[collection] || [];
    }
  },

  insert: async (collection: string, data: any) => {
    try {
      const result = await client.query(
        q.Create(q.Collection(collection), { data })
      );
      return result;
    } catch (error) {
      console.error('Fauna insert error:', error);
      throw error;
    }
  },

  update: async (collection: string, ref: any, data: any) => {
    try {
      const result = await client.query(
        q.Update(q.Ref(q.Collection(collection), ref), { data })
      );
      return result;
    } catch (error) {
      console.error('Fauna update error:', error);
      throw error;
    }
  },

  delete: async (collection: string, ref: any) => {
    try {
      const result = await client.query(
        q.Delete(q.Ref(q.Collection(collection), ref))
      );
      return result;
    } catch (error) {
      console.error('Fauna delete error:', error);
      throw error;
    }
  }
};

export default fauna;