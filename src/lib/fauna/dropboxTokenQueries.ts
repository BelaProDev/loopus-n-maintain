import { getFaunaClient } from './client';
import { query as q } from 'faunadb';

interface TokenDocument {
  data: {
    token: string;
  };
  ref?: {
    id: string;
  };
}

export const dropboxTokenQueries = {
  getToken: async () => {
    try {
      const client = getFaunaClient();
      const result = await client.query<TokenDocument>(
        q.Get(q.Match(q.Index('dropbox_token')))
      );
      return result.data.token;
    } catch (error) {
      console.warn('Error fetching Dropbox token:', error);
      return null;
    }
  },

  storeToken: async (token: string) => {
    try {
      const client = getFaunaClient();
      const result = await client.query<TokenDocument>(
        q.Update(
          q.Select('ref', q.Get(q.Match(q.Index('dropbox_token')))),
          { data: { token } }
        )
      );
      return result.data.token;
    } catch (error) {
      console.warn('Error storing Dropbox token:', error);
      return null;
    }
  },

  updateToken: async (token: string) => {
    return dropboxTokenQueries.storeToken(token);
  }
};