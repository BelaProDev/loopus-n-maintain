import { fql } from 'fauna';
import { client } from './client';
import type { DropboxTokenData } from '@/types/dropbox';
import { extractFaunaData } from './utils';

export const dropboxTokenQueries = {
  storeToken: async (userId: string, refreshToken: string): Promise<boolean> => {
    try {
      const tokenData = {
        userId,
        refreshToken,
        createdAt: new Date().toISOString()
      };

      const query = fql`
        let existing = dropbox_tokens.firstWhere(.userId == ${userId})
        if (existing != null) {
          existing.update({
            refreshToken: ${refreshToken},
            updatedAt: Time.now()
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
        let doc = dropbox_tokens.firstWhere(.userId == ${userId})
        if (doc == null) {
          null
        } else {
          {
            userId: doc.userId,
            refreshToken: doc.refreshToken,
            createdAt: doc.createdAt
          }
        }
      `;
      
      const result = await client.query(query);
      return result ? extractFaunaData<DropboxTokenData>(result)[0] : null;
    } catch (error) {
      console.error('Failed to get Dropbox token:', error);
      return null;
    }
  }
};