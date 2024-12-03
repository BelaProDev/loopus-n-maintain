import { fql } from 'fauna';
import { client } from './client';
import type { DropboxTokenData } from '@/types/dropbox';

export const dropboxTokenQueries = {
  storeToken: async (userId: string, refreshToken: string): Promise<boolean> => {
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
    try {
      const query = fql`
        let doc = dropbox_tokens.firstWhere(.userId == ${userId})
        doc ? {
          userId: doc.userId,
          refreshToken: doc.refreshToken,
          lastUpdated: doc.lastUpdated
        } : null
      `;
      
      const result = await client.query<DropboxTokenData | null>(query);
      return result || null;
    } catch (error) {
      console.error('Failed to get Dropbox token:', error);
      return null;
    }
  }
};