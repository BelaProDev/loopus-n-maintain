import { fql } from 'fauna';
import { getFaunaClient } from './client';
import type { DropboxTokenData } from '@/types/dropbox';

export const dropboxTokenQueries = {
  storeToken: async (userId: string, refreshToken: string): Promise<boolean> => {
    const client = getFaunaClient();
    try {
      const tokenData = {
        userId,
        refreshToken,
        lastUpdated: new Date().toISOString(),
        type: 'dropbox_token'
      };
      
      const query = fql`
        let tokenDoc = dropbox_tokens.firstWhere(.userId == ${userId})
        
        if(tokenDoc != null) {
          tokenDoc.update(${tokenData})
        } else {
          dropbox_tokens.create(${tokenData})
        }
      `;
      
      await client.query(query);
      return true;
    } catch (error) {
      console.error('Failed to store Dropbox token:', error);
      return false;
    }
  },

  getToken: async (userId: string): Promise<DropboxTokenData | null> => {
    const client = getFaunaClient();
    try {
      const query = fql`
        let doc = dropbox_tokens.firstWhere(.userId == ${userId})
        {
          userId: doc.userId,
          refreshToken: doc.refreshToken,
          lastUpdated: doc.lastUpdated
        }
      `;
      
      const result = await client.query<{ data: DropboxTokenData }>(query);
      return result.data || null;
    } catch (error) {
      console.error('Failed to get Dropbox token:', error);
      return null;
    }
  }
};