import { fql } from 'fauna';
import { client } from './client';
import type { DropboxTokenData } from '@/types/dropbox';
import { extractFaunaData } from './utils';

export const dropboxTokenQueries = {
  storeToken: async (userId: string, refreshToken: string): Promise<boolean> => {
    try {
      const tokenData: DropboxTokenData = {
        userId,
        refreshToken,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const query = fql`
        let existing = dropbox_tokens.firstWhere(.userId == ${userId})
        if (existing != null) {
          existing.update({
            refreshToken: ${refreshToken},
            updatedAt: ${tokenData.updatedAt}
          })
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
        dropbox_tokens.firstWhere(.userId == ${userId})
      `;
      
      const result = await client.query(query);
      if (!result) return null;

      const tokens = extractFaunaData<DropboxTokenData>(result);
      return tokens[0] || null;
    } catch (error) {
      console.error('Failed to get Dropbox token:', error);
      return null;
    }
  }
};