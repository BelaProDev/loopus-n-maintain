import { fql } from 'fauna';
import { getFaunaClient } from './client';
import type { DropboxTokenData } from './types';

export const dropboxTokenQueries = {
  storeToken: async (userId: string, refreshToken: string): Promise<boolean> => {
    const client = getFaunaClient();
    try {
      const query = fql`
        let tokenData = {
          userId: ${userId},
          refreshToken: ${refreshToken},
          lastUpdated: Time.now()
        }
        
        let existingToken = dropbox_tokens.firstWhere(.userId == ${userId})
        
        if(existingToken != null) {
          existingToken.update(tokenData)
        } else {
          dropbox_tokens.create(tokenData)
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
        dropbox_tokens.firstWhere(.userId == ${userId})
      `;
      
      const result = await client.query(query);
      return result ? result as DropboxTokenData : null;
    } catch (error) {
      console.error('Failed to get Dropbox token:', error);
      return null;
    }
  }
};