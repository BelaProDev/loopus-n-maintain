import { getFaunaClient } from './client';
import { query as q } from 'faunadb';

export const dropboxTokenQueries = {
  getToken: async () => {
    try {
      const client = getFaunaClient();
      const result = await client.query(
        q.Get(q.Match(q.Index('dropbox_token')))
      );
      return result.data.token;
    } catch (error) {
      console.warn('Error fetching Dropbox token:', error);
      return null;
    }
  },

  updateToken: async (token: string) => {
    try {
      const client = getFaunaClient();
      const result = await client.query(
        q.Update(
          q.Select('ref', q.Get(q.Match(q.Index('dropbox_token')))),
          { data: { token } }
        )
      );
      return result.data.token;
    } catch (error) {
      console.warn('Error updating Dropbox token:', error);
      return null;
    }
  }
};
