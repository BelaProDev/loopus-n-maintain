import { getFaunaClient } from './client';
import { fql } from 'fauna';

interface TokenData {
  token: string;
}

export const dropboxTokenQueries = {
  getToken: async () => {
    try {
      const client = getFaunaClient();
      const result = await client.query(fql`
        let doc = tokens.firstWhere(.type == "dropbox")
        { data: { token: doc.data.token } }
      `);
      return (result.data as TokenData).token;
    } catch (error) {
      console.warn('Error fetching Dropbox token:', error);
      return null;
    }
  },

  storeToken: async (token: string) => {
    try {
      const client = getFaunaClient();
      const result = await client.query(fql`
        let doc = tokens.firstWhere(.type == "dropbox")
        doc.update({ data: { token: ${token} } })
        { data: { token: doc.data.token } }
      `);
      return (result.data as TokenData).token;
    } catch (error) {
      console.warn('Error storing Dropbox token:', error);
      return null;
    }
  },

  updateToken: async (token: string) => {
    return dropboxTokenQueries.storeToken(token);
  }
};